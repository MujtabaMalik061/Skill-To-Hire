import { Apple, GitBranch } from "lucide-react";

const providerOptions = [
  { id: "google", label: "Google", mark: "G" },
  { id: "github", label: "GitHub", icon: GitBranch },
  { id: "apple", label: "Apple", icon: Apple },
];

const ProviderButtons = ({ onSelect, disabled = false }) => (
  <div className="provider-buttons">
    {providerOptions.map((provider) => {
      const ProviderIcon = provider.icon;

      return (
        <button
          key={provider.id}
          className="provider-button"
          type="button"
          disabled={disabled}
          onClick={() => onSelect(provider.id)}
        >
          {ProviderIcon ? (
            <ProviderIcon size={15} aria-hidden="true" />
          ) : (
            <span className="provider-button__mark" aria-hidden="true">
              {provider.mark}
            </span>
          )}
          {provider.label}
        </button>
      );
    })}
  </div>
);

export default ProviderButtons;
