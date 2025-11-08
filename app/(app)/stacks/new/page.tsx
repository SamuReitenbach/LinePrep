import { StackForm } from "../stack-form";

export default function NewStackPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Learning Stack</h1>
        <p className="text-default-500">
          Organize openings into a themed collection for focused practice
        </p>
      </div>

      <StackForm mode="create" />
    </div>
  );
}