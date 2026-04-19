import InlineLoader from '@/components/shared/InlineLoader';

export default function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-12">
      <InlineLoader />
    </div>
  );
}
