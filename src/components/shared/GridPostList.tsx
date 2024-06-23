import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[] | undefined;
  showUser?: boolean;
  showStats?: boolean;
};
const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts?.map((p) => {
        return (
          <li key={p.$id} className="relative min-w-80 h-80">
            <Link to={`/posts/${p.$id}`} className="grid-post_link">
              <img
                src={p.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2">
                  <img
                    src={p?.creator?.imageUrl}
                    alt="creator"
                    className="h-8 w-8 rounded-full"
                  />
                  <p className="line-clamp-1">{p?.creator?.name}</p>
                </div>
              )}
              {showStats && <PostStats post={p} userId={user.id} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
