import { MESSAGING_CAPABILITY_NAME } from "../shared/constants";

export function MessagingShell() {
  return (
    <div>
      <h3>{MESSAGING_CAPABILITY_NAME}</h3>
      <p>Capability shell for thread creation and messaging workflows.</p>
    </div>
  );
}
