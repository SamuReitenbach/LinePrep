import { CustomOpeningForm } from "../custom-opening-form";

export default function NewCustomOpeningPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create Custom Opening</h1>
        <p className="text-default-500">
          Build your own opening line by making moves on the board
        </p>
      </div>

      <CustomOpeningForm mode="create" />
    </div>
  );
}