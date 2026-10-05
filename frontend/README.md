
---

# nexaFit Frontend

This is the frontend of the Calorie Management Platform, providing a user-friendly interface for tracking caloric intake and managing meal plans. The application is built with **React**, styled using **TailwindCSS**, and deployed on **Vercel**. The backend for this project lives in this [repo](https://github.com/ezahpizza/nexaFit-backend) and is deployed on Render as a web service.

## Features

- **User Dashboard**: Displays daily caloric intake, nutritional data, and suggested meal plans.
- **Authentication**: User registration and login powered by Clerk.
- **API Integration**: Interacts with the FastAPI backend to fetch and update calorie data.
- **Responsive Design**: Optimized for mobile and desktop views.

## Tech Stack

- **React**: Frontend JavaScript framework
- **TailwindCSS**: Utility-first CSS framework for styling
- **Vercel**: Deployment platform for frontend applications
- **Axios**: HTTP client for API requests
- **Clerk**: Authentication and user management

## Environment Variables

Ensure that you have the following environment variables in your `.env` file:

```bash
REACT_APP_API_URL=<your-backend-api-url>
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd calorie-management-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Deployment

The frontend is deployed on **Vercel**. After pushing changes to the repository, Vercel automatically handles the deployment process.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Let me know if you need any more changes!
