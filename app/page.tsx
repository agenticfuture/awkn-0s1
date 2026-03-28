import {
  LandingDashboard,
  LandingFooter,
  LandingHeader,
} from "@/components/landing-dashboard";

export default function RootPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      {/* Background Decorative Elements - Static for SSR */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <LandingHeader />
        <LandingDashboard />
        <LandingFooter />
      </div>
    </div>
  );
}
