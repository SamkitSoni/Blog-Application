import { useParams } from "react-router-dom";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlog } from "../hooks"
import { FullBlog } from "../components/FullBlog";

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog} = useBlog({
        id: id || ""
    });

    if (loading) {
        return <div>
            <div className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton /> 
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <FullBlog blog={blog} />
    </div>
}