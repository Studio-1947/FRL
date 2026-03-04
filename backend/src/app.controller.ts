import { Controller, Get, Header, VERSION_NEUTRAL, Version } from '@nestjs/common';

@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html')
  getHello() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FRL API | Developer Portal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800\u0026display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --bg: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border: rgba(148, 163, 184, 0.1);
          }

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            background-image: 
              radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
          }

          .container {
            position: relative;
            width: 100%;
            max-width: 540px;
            padding: 40px;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 32px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.8s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .logo-area {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary), #8b5cf6);
            border-radius: 24px;
            margin-bottom: 32px;
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .logo-icon {
            font-size: 40px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          }

          .badge {
            display: inline-block;
            padding: 8px 16px;
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 24px;
            border: 1px solid rgba(16, 185, 129, 0.2);
          }

          h1 {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 16px;
            background: linear-gradient(to right, #fff, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -1px;
          }

          p {
            color: var(--text-muted);
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 40px;
          }

          .actions {
            display: flex;
            gap: 16px;
            justify-content: center;
          }

          .btn {
            padding: 14px 28px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 15px;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .btn-primary {
            background-color: var(--primary);
            color: white;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
          }

          .btn-primary:hover {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4);
          }

          .btn-secondary {
            background: rgba(148, 163, 184, 0.1);
            color: var(--text-main);
            border: 1px solid var(--border);
          }

          .btn-secondary:hover {
            background: rgba(148, 163, 184, 0.2);
            transform: translateY(-2px);
          }

          .footer {
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px solid var(--border);
            color: var(--text-muted);
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-area">
            <span class="logo-icon">⚡</span>
          </div>
          <br/>
          <div class="badge">Systems Operational</div>
          <h1>FRL API Engine</h1>
          <p>The core infrastructure is live and ready for high-performance requests. Explore the docs below.</p>
          
          <div class="actions">
            <a href="/docs" class="btn btn-primary">
              View Documentation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <a href="/v1/status" class="btn btn-secondary">System Status</a>
          </div>

          <div class="footer">
            Powered by NestJS Core \u0026 Drizzle
          </div>
        </div>
      </body>
      </html>
    `;
  }

  @Get('status')
  getStatus() {
    return {
      message: 'FRL Backend API is operational',
      version: '1.0',
      status: 'success',
    };
  }

  @Version('1')
  @Get()
  getApiV1Root() {
    return {
      message: 'FRL Backend API v1 is operational',
      version: '1.0',
      docs: '/docs',
    };
  }
}
