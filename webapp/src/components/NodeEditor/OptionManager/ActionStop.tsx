import InputText from "components/Inputs/Base/InputText";
import { StopAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";

export const ActionStopState: OptionManager<StopAction> = {
  defaultState: () => ({
    alias: "",
    stop: "",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
        <InputText
          label="Stop Reason"
          value={state.stop ?? []}
          onChange={(d) => setState({ ...state, stop: d })}
        />
      </>
    );
  },
};
