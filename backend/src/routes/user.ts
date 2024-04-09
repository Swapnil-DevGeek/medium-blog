import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import {signinInput,signupInput} from "@swapnilsoni1704/medium-common"

export const userRouter = new Hono<{
    Bindings :{
        DATABASE_URL :string,
        JWT_KEY : string
    }
}>();

userRouter.post('/signup',async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
}).$extends(withAccelerate())

  const body = await c.req.json();
  const {success} = signupInput.safeParse(body);
  if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
  try {
    const user = await prisma.user.create({
      data:{
        email : body.email,
        password : body.password
      }
    })
    const token  = await sign({id : user.id},c.env.JWT_KEY);
    return c.json({
      user_id : user.id,
      user_name : user.email,
      jwt:token
    });
  } catch (error) {
    c.status(400);
    console.log(error);
    return c.text("Error while signing up!");
  }
})

userRouter.post('/signin',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

  const user = await prisma.user.findUnique({
    where:{
      email : body.email
    }
  });

  if(!user){
    c.status(403);
    return c.json({message : "User doesnot exists!"});
  }

  if(body.password != user.password){
    c.status(403);
    return c.json({message : "Incorrect Password!"});
  }
  const jwt = await sign({id : user.id},c.env.JWT_KEY);

  return c.json({
    jwt
  });

})