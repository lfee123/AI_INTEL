import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';

interface SearchFormInputs {
  company: string;
}

export default function SearchBar() {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormInputs>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: SearchFormInputs) => {
    if (data.company.trim()) {
      setIsSubmitting(true);
      router.push(`/research/${encodeURIComponent(data.company.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[680px] mx-auto mt-8 relative">
      <div className="relative flex items-center w-full group">
        <Search className="absolute left-4 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors z-10" />
        <input
          {...register('company', { required: true })}
          type="text"
          placeholder="Enter company name — e.g. Apple, Nvidia, Infosys"
          className="w-full h-14 pl-12 pr-32 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-lg"
          disabled={isSubmitting}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 bg-accent hover:bg-accent/90 text-white font-medium rounded-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Loading...' : 'Analyse'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      {errors.company && <p className="text-bear text-sm mt-2 absolute">Please enter a company name</p>}
    </form>
  );
}
