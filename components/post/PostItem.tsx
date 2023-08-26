import { useRef, useState } from "react";
import { useAuth, useBottomSheetBack } from "../../lib/hooks";
import { useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import { View } from "tamagui";
import { useMutation } from "@apollo/client";
import {
  CreateCommentDocument,
  CreateOneCollectedPostDocument,
  CreateOneLikeDocument,
  CreateViewDocument,
  DeleteOneCollectedPostDocument,
  DeleteOneLikeDocument,
  Post,
  PostDocument,
} from "../../generated/gql/graphql";
import ActionPanel from "./ActionPanel";
import CommentSheet from "./CommentSheet";
import PostContent from "./PostContent";
import ControlSheet from "./ControlSheet";
import ImageCarousel from "../ImageCarousel";
import HeartOverlay from "./HeartOverlay";
import { TapGestureHandler } from "react-native-gesture-handler";
import PollSheet from "../PollSheet";

interface PostItemProps {
  post: Post;
  onNavigate: () => void;
}

/**
 * There is an annoying issue where we need to update each post when
 * a user likes it. We should probably refactor our state management
 * to better allow for inverse data flow - maybe storing all posts in state
 * and providing callbacks in the child components to update this state.
 *
 * Issue with this approach: we need to keep the order of posts when updating,
 * which can prove to be challenging.
 *
 * UPDATE: Solved by updating Apollo Client cache!
 **/

export default function PostItem({ post, onNavigate }: PostItemProps) {
  const identifier = useRef(post.id);
  const ref = useRef(null);
  const scale = useSharedValue(0);
  const start = useRef(Date.now());
  const { user } = useAuth();
  const [like] = useMutation(CreateOneLikeDocument);
  const [unlike] = useMutation(DeleteOneLikeDocument);
  const [comment] = useMutation(CreateCommentDocument);
  const [view] = useMutation(CreateViewDocument);
  const [collect] = useMutation(CreateOneCollectedPostDocument);
  const [uncollect] = useMutation(DeleteOneCollectedPostDocument);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [pollOpen, setPollOpen] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likes.some((like) => like.userId === user?.id)
  );

  const [isSaved, setIsSaved] = useState<boolean>(
    post.saves.some((save) => save.userId === user?.id)
  );

  useBottomSheetBack(commentsOpen, () => setCommentsOpen(false));
  useBottomSheetBack(shareOpen, () => setShareOpen(false));
  useBottomSheetBack(pollOpen, () => setPollOpen(false));
  if (identifier.current !== post.id) {
    view({
      variables: {
        data: {
          post: { connect: { id: post.id } },
          user: { connect: { id: user?.id } },
          endedAt: Date.now(),
          startedAt: start.current,
        },
      },
    });

    identifier.current = post.id;
    setIsLiked(post.likes.some((like) => like.userId === user?.id));
    setIsSaved(post.saves.some((save) => save.userId === user?.id));
    setCommentsOpen(false);
    setShareOpen(false);
  }

  const animate = () => {
    scale.value = withSpring(1, { velocity: 1 }, (isFinished) => {
      if (isFinished) scale.value = withDelay(200, withSpring(0));
    });
  };

  const handleComment = async (text: string) => {
    await comment({
      variables: {
        data: {
          author: { connect: { id: user?.id } },
          content: text,
          post: { connect: { id: post.id } },
        },
      },
      update: (cache, { data }) => {
        if (!data) return;
        cache.updateQuery(
          { query: PostDocument, variables: { where: { id: post.id } } },
          (cached) => {
            if (!cached?.post) return undefined;
            return {
              post: {
                ...cached.post,
                comments: [...cached.post.comments, data.createOneComment],
              },
            };
          }
        );
      },
    });
  };

  const handleCollect = async () => {
    if (!user) return;
    if (isSaved) {
      await uncollect({
        variables: { where: { key: { postId: post.id, userId: user.id } } },
        onCompleted: () => setIsSaved(false),
        update: (cache, { data }) => {
          if (!data) return;
          cache.updateQuery(
            { query: PostDocument, variables: { where: { id: post.id } } },
            (cached) => {
              if (!cached?.post) return undefined;
              return {
                post: {
                  ...cached.post,
                  saves: cached.post.saves.filter(
                    (save) => save.id !== data.deleteOneCollectedPost?.id
                  ),
                },
              };
            }
          );
        },
      });
    } else {
      await collect({
        variables: {
          data: {
            post: { connect: { id: post.id } },
            user: { connect: { id: user.id } },
          },
        },
        onCompleted: () => setIsSaved(true),
        update: (cache, { data }) => {
          if (!data) return;
          cache.updateQuery(
            { query: PostDocument, variables: { where: { id: post.id } } },
            (cached) => {
              if (!cached?.post) return undefined;
              return {
                post: {
                  ...cached.post,
                  saves: [...cached.post.saves, data.createOneCollectedPost],
                },
              };
            }
          );
        },
      });

      setIsSaved(true);
    }
  };

  // Note: Liking is slow.
  const onDoubleTap = async () => {
    if (!user) return;
    if (isLiked) return animate();
    await like({
      variables: {
        data: {
          post: { connect: { id: post.id } },
          user: { connect: { id: user.id } },
        },
      },
      update: (cache, { data }) => {
        if (!data) return;
        cache.updateQuery(
          { query: PostDocument, variables: { where: { id: post.id } } },
          (cached) => {
            if (!cached?.post) return undefined;
            return {
              post: {
                ...cached.post,
                likes: [...cached.post.likes, data.createOneLike],
              },
            };
          }
        );
      },
    });

    animate();
    setIsLiked(true);
  };

  const handleUnlike = async () => {
    if (!user) return;
    if (!isLiked) return;
    await unlike({
      variables: { where: { key: { postId: post.id, userId: user.id } } },
      update: (cache) => {
        cache.updateQuery(
          { query: PostDocument, variables: { where: { id: post.id } } },
          (cached) => {
            if (!cached?.post) return undefined;
            return {
              post: {
                ...cached.post,
                likes: cached.post.likes.filter(
                  (like) => like.postId === post.id && like.userId !== user.id
                ),
              },
            };
          }
        );
      },
    });

    setIsLiked(false);
  };

  // Height doesn't include status bar height on some Android phones.)
  // TODO: The full screen posts doesn't work on Android for some reason.
  return (
    <View flex={1} backgroundColor={"black"}>
      <TapGestureHandler ref={ref} onActivated={onDoubleTap} numberOfTaps={2}>
        <View flex={1}>
          <ImageCarousel innerRef={ref} attachments={post.attachments} />
          <HeartOverlay
            innerRef={ref}
            scale={scale}
            onActivated={onDoubleTap}
          />
        </View>
      </TapGestureHandler>

      <PostContent post={post} onNavigate={onNavigate} />
      <ActionPanel
        post={post}
        onCommentPress={() => setCommentsOpen(true)}
        onSavePress={handleCollect}
        onLikePress={() => (isLiked ? handleUnlike() : onDoubleTap())}
        onSharePress={() => setShareOpen(true)}
        onPollPress={() => setPollOpen(true)}
      />
      <CommentSheet
        post={post}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        onComment={handleComment}
      />
      <ControlSheet
        post={post}
        open={shareOpen}
        onOpenChange={() => setShareOpen(false)}
      />
      <PollSheet
        post={post}
        open={pollOpen}
        onClose={() => setPollOpen(false)}
      />
    </View>
  );
}
