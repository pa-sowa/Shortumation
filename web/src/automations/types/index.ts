import { AutomationAction } from "./actions";
import { AutomationCondition } from "./conditions";
import { AutomationTrigger } from "./triggers";


export interface AutomationMetadata {
    id: string;
    alias: string;
    description: string;
    trigger_variables?: Record<string, string>;
    mode: "single" | "restart" | "queued" | "parallel";
}
export interface AutomationData {
    metadata: AutomationMetadata;
    trigger: AutomationTrigger[];
    condition: AutomationCondition[];
    action: AutomationSequenceNode[];
}
export type AutomationSequenceNode = AutomationAction | AutomationCondition;
type AutomationNodeMapping = {
    "trigger": AutomationTrigger;
    "action": AutomationAction;
    "condition": AutomationCondition;
    "sequence": AutomationSequenceNode;
}
export type AutomationNodeTypes = keyof AutomationNodeMapping;
export type AutomationNode<N extends AutomationNodeTypes = any> = AutomationNodeMapping[N];