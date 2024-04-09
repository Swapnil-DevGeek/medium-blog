import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {createPostInput,updatePostInput} from "@swapnilsoni1704/medium-common"

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_KEY: string;
  },
  Variables : {
    user_id : string
  }
}>();

postRouter.use("/*", async (c, next) => {
  
    const header = c.req.header("Authorization") || "";
    const res = await verify(header, c.env.JWT_KEY);

  if (res.id) {
    c.set("user_id",res.id);
    await next();
  } else {
    c.status(403);
    return c.text("Unauthorized!");
  }
});

postRouter.post("/",async (c) => {
  const prisma  = new PrismaClient({
    datasourceUrl : c.env?.DATABASE_URL
  }).$extends(withAccelerate())

  const body =await c.req.json();
  const { success } = createPostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

  const user_id = c.get("user_id");
  try {  
  const post = await prisma.post.create({
    data : {
        title : body.title,
        content : body.content,
        authorId : user_id
    },
  })
  return c.json({id: post.id});
  } catch (error) {
    
  }
});

postRouter.put("/",async (c) => {
    const prisma  = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      const body =await c.req.json();
      const { success } = updatePostInput.safeParse(body);
      if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
      }
      const post = await prisma.post.update({
        where : {
            id : body.id,
        },
        data : {
            title : body.title,
            content : body.content
        }
      })

      return c.json({
        id : post.id,
        title : post.title,
        content : post.content
    });
});

postRouter.get("/bulk",async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    try {
      const blogs = await prisma.post.findMany();
      return c.json({blogs});
    } catch (error) {
      c.status(411);
      return c.json({message : "Error while fetching blog post"});
    }
  });

postRouter.get("/:id",async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl : c.env?.DATABASE_URL
  }).$extends(withAccelerate())
  const id = c.req.param("id");
  try {
    const post = await prisma.post.findFirst({
        where : {
            id : id
        }
      });
      if(!post){
        c.status(404);
        return c.json({message : "Post not found!"});
      }
      
      return c.json({
        id : post?.id,
        title : post?.title,
        content : post?.content,
      })
  } catch (error) {
    c.status(411);
    return c.json({message : "Error while fetching blog post"});
  }
});

