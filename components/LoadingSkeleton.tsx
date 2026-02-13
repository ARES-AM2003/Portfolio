'use client'

export function ProjectCardSkeleton() {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden animate-pulse">
      <div className="relative h-64 bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
        <div className="flex gap-2">
          <div className="h-6 bg-white/10 rounded w-16" />
          <div className="h-6 bg-white/10 rounded w-20" />
          <div className="h-6 bg-white/10 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkillCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-5 bg-white/10 rounded w-24" />
        <div className="h-4 bg-white/10 rounded w-16" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="h-3 bg-white/10 rounded w-16" />
          <div className="h-3 bg-white/10 rounded w-10" />
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <div className="bg-white/10 h-2 rounded-full w-3/4" />
        </div>
      </div>
    </div>
  )
}

export function ExperienceCardSkeleton() {
  return (
    <div className="flex gap-6 animate-pulse">
      <div className="flex-shrink-0 w-32">
        <div className="h-5 bg-white/10 rounded w-24" />
      </div>
      <div className="flex-1 pb-8 border-l-2 border-white/10 pl-6 space-y-3">
        <div className="h-6 bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
      </div>
    </div>
  )
}
