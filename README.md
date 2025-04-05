# NestJS Vercel Starter

A minimal and production-ready starter template to deploy **NestJS** on **Vercel**.

This project was bootstrapped using `nest new`, and adapted to work seamlessly with **Vercel’s serverless architecture** by building and serving the app from the `/api` directory. No need to tweak the configuration on Vercel, `vercel.json` will handle this.

> ✅ Great for quick deployments, serverless APIs, or testing NestJS on Vercel.

## 🛠️ Adapting Your Own NestJS Project

Want to bring your own NestJS project to Vercel?

You’ve got two options:

1. **Follow the step-by-step guide**  
   👉 [Read the blog post](https://42-commits-later.hashnode.dev/how-to-host-nestjs-on-vercel)

2. **Run the setup script**  
   Use the `script.js` included in this repo by running `node script.js`, it will automatically configure everything for you.  
   ⚠️ _Make sure to commit or back up your changes before running the script!_

---

## 📦 Deployment Strategy

Vercel expects your backend code to live in the `/api` folder and be exportable as serverless functions.

To support this:

- The build process compiles the NestJS app into `/api`
- Vercel picks up each entry point and deploys it as an independent serverless function
- This setup enables fast, scalable, and low-maintenance backend deployments

---

## 🧪 Getting Started Locally

```bash
# install dependencies
npm install

# build the app into /api
npm run build

# install the vercel cli globally
npm install -g vercel

# deploy on vercel
vercel deploy
```

.
├── api/ # Compiled output, used by Vercel (do not edit directly)
├── src/ # Your actual NestJS source code
├── script.js # Setup script to make your NestJS project Vercel-ready
└── vercel.json # Vercel configuration file

## 🧠 Why NestJS + Vercel?

- Vercel is an intuitive platform packed with powerful features, perfect for projects of any scale.
- As the creators of Next.js, they focus on building the perfect environment for modern web apps.
- Best of all? It’s free to get started — and the free tier is incredibly generous.

## 🤝 Contributions

Feel free to fork, submit issues, or contribute improvements!
