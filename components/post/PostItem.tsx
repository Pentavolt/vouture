import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useAuth, useBottomSheetBack } from "../../lib/hooks";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { View } from "tamagui";
import { useMutation } from "@apollo/client";
import {
  CreateCommentDocument,
  CreateOneLikeDocument,
  CreateViewDocument,
  DeleteOneLikeDocument,
  Post,
  PostDocument,
  PostQuery,
} from "../../generated/gql/graphql";
import { AnimatableClothingLabel } from "./ClothingLabel";
import FastImage from "react-native-fast-image";
import ActionPanel from "./ActionPanel";
import CommentSheet from "./CommentSheet";
import PostGestureView from "./PostGesture";
import PostContent from "./PostContent";

interface PostItemProps {
  post: Post;
  onNavigate: () => void;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
const AnimatedClothingLabel = Animated.createAnimatedComponent(
  AnimatableClothingLabel
);

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
  const scale = useSharedValue(0);
  const fade = useSharedValue(1);
  const start = useRef(Date.now());
  const { user } = useAuth();
  const [like] = useMutation(CreateOneLikeDocument);
  const [unlike] = useMutation(DeleteOneLikeDocument);
  const [comment] = useMutation(CreateCommentDocument);
  const [view] = useMutation(CreateViewDocument);
  const [open, setOpen] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likes.some((like) => like.userId === user?.id)
  );

  useBottomSheetBack(open, () => setOpen(false));
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
    setOpen(false);
  }

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

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
        cache.writeQuery<PostQuery>({
          query: PostDocument,
          data: {
            post: {
              ...post,
              comments: [...post.comments, data.createOneComment],
            },
          },
        });
      },
    });
  };

  const onSingleTap = () => {
    if (fade.value) fade.value = withTiming(0, { duration: 300 });
    else fade.value = withTiming(1, { duration: 300 });
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
        cache.writeQuery<PostQuery>({
          query: PostDocument,
          data: {
            post: {
              ...post,
              likes: [...post.likes, data?.createOneLike],
            },
          },
        });
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
        cache.writeQuery<PostQuery>({
          query: PostDocument,
          data: {
            post: {
              ...post,
              likes: post.likes.filter(
                (like) => like.postId === post.id && like.userId !== user.id
              ),
            },
          },
        });
      },
    });

    setIsLiked(false);
  };

  // Height doesn't include status bar height on some Android phones.)
  // TODO: The full screen posts doesn't work on Android for some reason.
  return (
    <View flex={1} backgroundColor={"black"}>
      <PostGestureView onDoubleTap={onDoubleTap} onSingleTap={onSingleTap}>
        <View flex={1}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              flex: 1,
              zIndex: 1,
            }}
          >
            {post.tags.map((tag, idx) => (
              <AnimatedClothingLabel
                key={idx}
                tag={tag}
                style={{ ...fadeStyle }}
              />
            ))}
          </Animated.View>
          <FastImage
            resizeMode="contain"
            source={{ uri: post.attachments[0].url }}
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              height: "100%",
            }}
          />
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <AnimatedIcon
              name="heart"
              color={"#ef4444"}
              style={{ ...scaleStyle }}
              size={100}
            />
          </Animated.View>
        </View>
      </PostGestureView>
      <PostContent post={post} onNavigate={onNavigate} />
      <ActionPanel
        likes={post.likes}
        comments={post.comments}
        onCommentPress={() => setOpen(true)}
        onSavePress={() => null}
        onLikePress={() => (isLiked ? handleUnlike() : onDoubleTap())}
      />
      <CommentSheet
        comments={post.comments}
        open={open}
        onClose={() => setOpen(false)}
        onComment={handleComment}
      />
    </View>
  );
}
