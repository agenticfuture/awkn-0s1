import {
  LandingDashboard,
  LandingFooter,
  LandingHeader,
} from "@/components/landing-dashboard";

export default function RootPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7f1e8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(170,125,70,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,37,20,0.08),transparent_35%)]" />
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),transparent)]" />
      <div className="relative z-10">
        <LandingHeader />
        <LandingDashboard />
        <LandingFooter />
      </div>
    </div>
  );
}
