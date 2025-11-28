import express from 'express'
import redis from '../config/redis.js'

export const rateLimitMiddleware = (totalreq,time) => async(req, res, next) => {
   const ip = req.ip
   const key = `rate-limit:${ip}`
  
  try {
      const reqs = await redis.incr(key)
      if (reqs === 1) {
          redis.expire(key, time)
      }
      if (reqs > totalreq) {
          return res.status(429).json({ message: "Too many requests. Please try again later." })
      }

      next();
  } catch (error) {
    console.log(error,"this is the error ");
      next();
  }
};