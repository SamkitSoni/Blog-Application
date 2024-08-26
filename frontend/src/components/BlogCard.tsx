interface BlogCardProps {
    authorName: string,
    title: string,
    content: string,
    id: string,
    publishedDate: string
}

export const BlogCard = ({
    authorName,
    title,
    content,
    id,
    publishedDate

}: BlogCardProps) => {
    return <div className=" p-3 border-b border-slate-200 pb-4">
        <div className="flex">
            <div className="flex justify-center flex-col">
                <Avatar name= {authorName} size={"small"} />
            </div>
            <div className="font-extralight pl-2 capitalize flex justify-center flex-col">   
                {authorName} -
            </div>
            <div className="pl-1 font-thin text-slate-400 flex justify-center flex-col">
                {publishedDate}
            </div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-xl font-thin">
            {content.slice(0,100) + "..."}
        </div>
        <div className="text-slate-500 text-sm font-thin pt-3">
            {`${Math.ceil(content.length/100)} minute(s) read`}
        </div>
    </div>
}

export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
    return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
    <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-gray-600 dark:text-gray-300`}>
        {name[0]}
    </span>
</div>
}