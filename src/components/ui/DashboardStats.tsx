type Props = {
  number: number;
  label: string;
  icon: React.ReactNode;
};

export default function DashboardStatCard({ number, label, icon }: Props) {
  return (
    <div className="flex sm:flex-row flex-col h-44 items-center justify-between rounded-3xl bg-white/10 px-8 backdrop-blur-sm">
      <div>
        <h3 className="text-lg sm:text-4xl font-bold text-white">{number}</h3>

        <p className="mt-3 text-lg text-white/80">{label}</p>
      </div>

      {icon}
    </div>
  );
}
