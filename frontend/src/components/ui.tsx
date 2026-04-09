import type { PropsWithChildren } from 'react'

export function Card({ children }: PropsWithChildren) {
  return <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">{children}</div>
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger'
  },
) {
  const { variant = 'secondary', className = '', ...rest } = props
  const base =
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-white text-zinc-950 hover:bg-zinc-200'
      : variant === 'danger'
        ? 'bg-red-500 text-white hover:bg-red-400'
        : 'border border-zinc-800 text-zinc-200 hover:bg-zinc-900'

  return <button className={`${base} ${styles} ${className}`} {...rest} />
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      className={`w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
      {...rest}
    />
  )
}

export function Label({ children }: PropsWithChildren) {
  return <div className="mb-1 text-xs font-medium text-zinc-300">{children}</div>
}

