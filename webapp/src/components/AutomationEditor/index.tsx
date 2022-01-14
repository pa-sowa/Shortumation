import "./index.css";
import { DAGBoardElmDims } from "components/DAGSvgs/DAGBoard";
import { ArrowIcon } from "components/Icons";
import { SequenceNodes } from "components/SequenceNodes";
import { FC, useState } from "react";
import { AutomationData, AutomationSequenceNode } from "types/automations";
import useWindowSize from "utils/useWindowSize";
import { AutoInfoBox } from "./AutoInfoBox";
import { useEditorStyles } from "./styles";
import { computeTriggerPos, computeExtraField } from './positions';
import { chain } from "utils/iter";
import { AutomationTrigger } from 'types/automations/triggers';
import { Modal } from "components/Modal";
import { NodeEditor } from "components/NodeEditor";
import { ButtonIcon } from "components/Icons/ButtonIcons";

interface TriggerEditorModalState {
  trigger: AutomationTrigger;
  onSave: (node: AutomationTrigger) => void;
}
interface Props {
  automation: AutomationData;
  dims: DAGBoardElmDims;
  onUpdate: (auto: AutomationData) => void;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation,
  onUpdate,
}) => {
  // state
  const { ratioWbh } = useWindowSize();
  const [closeInfo, setCloseInfo] = useState(false);
  const [modalState, setModalState] = useState<null | TriggerEditorModalState>(null);
  const { classes } = useEditorStyles({
    closeInfo,
    horizontalMode: ratioWbh < 0.75
  });

  // alias
  const updateSequence = (sequence: AutomationSequenceNode[]) => onUpdate({
    ...automation,
    sequence,
  });
  const updateTriggers = (trigger: AutomationTrigger[]) => onUpdate({
    ...automation,
    trigger,
  });

  // render
  return <div className={classes.root}>
    <Modal open={!!modalState}>
      {!!modalState && <NodeEditor
        node={modalState.trigger}
        onClose={() => setModalState(null)}
        onSave={modalState.onSave as any}
        allowedTypes={['trigger']}
      />}
    </Modal>
    <AutoInfoBox
      className={closeInfo ? "hide" : "show"}
      metadata={automation.metadata}
      onUpdate={metadata => onUpdate({ ...automation, metadata })}
    >
      <ButtonIcon
        className={`${classes.infoIcon} automation-editor--info-icon`}
        onClick={() => setCloseInfo(!closeInfo)}
        title={closeInfo ? "Show Metadata" : "Hide Metadata"}
      >{ArrowIcon}</ButtonIcon>
    </AutoInfoBox>

    <SequenceNodes
      zoomLevel={1.5}
      startPoint={[2, 0.5]}
      dims={dims}
      sequence={automation.sequence}
      onChange={updateSequence}
      additionalElements={() => chain([
        computeExtraField([1, 0.5], [2, 0.5]),
        computeTriggerPos(
          [0.5, 0.5],
          automation.trigger,
          [1.5, 0.5],
          updateTriggers,
          () => {
            setModalState({
              trigger: {
                $smType: "trigger",
                platform: "device",
                device_id: "",
                domain: "",
                type: "",
                subtype: ""
              },
              onSave: (t) => updateTriggers([...automation.trigger, t])
            });
          },
          (trigger, onSave) => setModalState({
            trigger,
            onSave,
          })
        ),
      ])}
    />
  </div>
}
