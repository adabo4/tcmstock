type Props = {
  number: number;
  label: string;
  icon: React.ReactNode;
};

export default function DashboardStatCard({ number, label, icon }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl bg-white/10 px-3 py-3 sm:px-6 sm:h-28 backdrop-blur-sm gap-1 sm:gap-0">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">{number}</h3>

        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-white/80 leading-tight">
          {label}
        </p>
      </div>

      {icon}
    </div>
  );
}
