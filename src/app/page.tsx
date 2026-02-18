import PipelineDiagram from '@/components/PipelineDiagram';

export default function Home() {
  return (
    <main className="h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] w-full bg-gray-950">
      <PipelineDiagram />
    </main>
  );
}
