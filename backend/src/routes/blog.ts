import { Hono } from "hono";
import { PrismaClient  } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@samkitsoni/packages_medium-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userID: string;
    }
}>()

blogRouter.use("/*", async (c,next) => {
    try {
        const authHeader = c.req.header("authorization") || "";
        const user = await verify(authHeader , c.env.JWT_SECRET);
        if(user) {
            c.set("userID", user.id as string);
            await next();
    } else {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
    } catch (e) {
        c.status(403);
        return c.json({ 
            message: "You are not logged in"
        })
    }
    
    
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authorID = c.get("userID");
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorID: authorID
        }
    })
    
    return c.json({
        id: post.id
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })
    return c.text('Updated post');
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({
        posts
    })
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const id = c.req.param("id");
        const post = await prisma.post.findFirst({
        where: {
            id: id
        },
        select: {
            id: true,
            title: true,
            content: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })

    return c.json({
        post
    })

    } catch (e) {
        c.status(411);
        return c.json({
            message: "Error while fetching blog post"
        })
    }
})


