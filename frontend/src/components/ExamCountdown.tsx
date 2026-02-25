import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

export function ExamCountdown() {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const examDate = new Date('2028-05-01');
      const today = new Date();
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-lg px-4 py-2 shadow-lg">
      <Calendar className="h-5 w-5 text-primary" />
      <div className="text-right">
        <div className="text-2xl font-bold text-primary">{daysRemaining}</div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">days to CA Final</div>
      </div>
    </div>
  );
}
