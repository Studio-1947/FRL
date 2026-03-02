import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AppController {
  @Get()
  getHello() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FRL Backend API</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f3f4f6;
          }
          .container {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            max-width: 500px;
            width: 90%;
          }
          h1 {
            color: #111827;
            margin-top: 0;
            margin-bottom: 0.5rem;
          }
          p {
            color: #6b7280;
            margin-bottom: 2rem;
            line-height: 1.5;
          }
          a {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          a:hover {
            background-color: #2563eb;
          }
          .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background-color: #def7ec;
            color: #03543f;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="status">● Systems Operational</div>
          <h1>FRL Backend is Running</h1>
          <p>The NestJS server has been successfully deployed and is currently listening for API requests.</p>
          <a href="/api/docs">View API Documentation</a>
        </div>
      </body>
      </html>
    `;
  }

  @Get()
  getApiV1() {
    return {
      message: 'FRL Backend API is operational',
      version: '1.0',
      status: 'success',
    };
  }
}
