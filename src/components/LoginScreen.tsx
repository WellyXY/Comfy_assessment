import { Download, Mail } from 'lucide-react'

type Props = {
  onLogin: () => void
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#fff"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.07 1.07-2.78 2.25-5.71 2.25-4.6 0-8.21-3.66-8.21-8.21S8.27 4.13 12.87 4.13c2.48 0 4.3.98 5.71 2.27l2.31-2.31C18.5 2.5 15.97 1.5 12.87 1.5 6.27 1.5 1 6.77 1 13.37s5.27 11.87 11.87 11.87c3.43 0 6.02-1.13 8.03-3.22 2.05-2.05 2.7-4.95 2.7-7.28 0-.72-.05-1.4-.16-1.97l-10.96-.04Z"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.07.78 2.15v3.18c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function LoginScreen({ onLogin }: Props) {
  return (
    <div className="flex flex-1 min-h-0">
      {/* Left — auth */}
      <div
        data-tag="login-auth"
        className="flex-1 flex flex-col bg-charcoal-800 relative"
      >
        {/* Top-left logo — the official Comfy wordmark from comfy.org */}
        <div className="absolute top-6 left-7 flex items-center gap-2 text-white">
          <img src="/brand/comfy-logo.svg" alt="Comfy" className="h-6 w-auto" />
          <span className="text-smoke-700 text-[0.8125rem] border-l border-charcoal-400 pl-2 ml-1">
            Cloud
          </span>
        </div>

        <div className="flex-1 flex items-center px-16">
          <div className="w-full max-w-[400px]">
            <h1 className="text-white text-[2.125rem] font-semibold tracking-tight leading-tight">
              Log in to your account
            </h1>
            <p className="text-smoke-700 text-[0.875rem] mt-3">
              New here?{' '}
              <a className="text-run hover:text-run/80 cursor-pointer">Sign up</a>
            </p>

            <div className="mt-8 space-y-3">
              <button
                onClick={onLogin}
                className="flex items-center justify-center gap-2.5 w-full h-12 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 border border-charcoal-400 text-white font-medium text-[0.875rem]"
              >
                <GoogleIcon />
                Log in with Google
              </button>
              <button
                onClick={onLogin}
                className="flex items-center justify-center gap-2.5 w-full h-12 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 border border-charcoal-400 text-white font-medium text-[0.875rem]"
              >
                <GithubIcon />
                Log in with Github
              </button>
            </div>

            <button
              onClick={onLogin}
              className="mt-5 w-full text-center text-smoke-500 hover:text-white text-[0.8125rem] underline underline-offset-4 flex items-center justify-center gap-1.5"
            >
              <Mail size={13} />
              Use email instead
            </button>

            <p className="mt-9 text-[0.75rem] text-smoke-700 leading-relaxed">
              By clicking "Next" or "Sign Up", you agree to our{' '}
              <a className="text-run hover:underline cursor-pointer">Terms of Use</a>{' '}
              and{' '}
              <a className="text-run hover:underline cursor-pointer">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Right — marketing */}
      <div className="hidden md:flex w-[48%] relative overflow-hidden">
        {/* Cinematic gradient backdrop standing in for Comfy's anime artwork */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(240,255,65,0.20),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_80%,rgba(23,45,215,0.45),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(11,140,233,0.20),transparent_55%)]" />

        {/* Star dots */}
        <svg className="absolute inset-0 w-full h-full opacity-50">
          {Array.from({ length: 50 }).map((_, i) => {
            const x = (i * 73) % 100
            const y = (i * 41) % 100
            const r = (i % 3) * 0.6 + 0.4
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r={r}
                fill="white"
                opacity={0.6}
              />
            )
          })}
        </svg>

        <div className="relative flex flex-col justify-center items-center text-center px-16 w-full">
          <h2 className="text-white font-extrabold tracking-tight leading-[0.95] uppercase text-[2.5rem]">
            Start Creating
            <br />
            in Seconds
          </h2>
          <p className="text-smoke-300 text-[1rem] mt-6 max-w-sm">
            Zero setup required. Works on any device.
          </p>
          <p className="text-smoke-300 text-[1rem] mt-1.5 max-w-sm">
            Generate multiple outputs at once. Share workflows with ease.
          </p>
        </div>

        <button className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-black/85 hover:bg-black text-white text-[0.8125rem] px-4 py-2.5 rounded-md font-medium">
          <Download size={14} />
          Download ComfyUI
        </button>

        <div className="absolute bottom-5 left-5 text-smoke-500 text-[0.75rem]">
          Want to run ComfyUI locally instead?
        </div>
      </div>
    </div>
  )
}
