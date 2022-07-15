import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConnectedAutomationList } from ".";
import { createMockAuto } from "utils/mocks";
import { useMockApiService } from "apiService";
import { Page } from "components/Page";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";

export default {
  title: "App/AutomationList/MockConnected",
  component: ConnectedAutomationList,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    dims: DEFAULT_DIMS,
    initialAutomations: [],
  },
} as ComponentMeta<typeof ConnectedAutomationList>;

const Template: ComponentStory<any> = (args) => {
  const api = useMockApiService(args.initialAutomations);
  return (
    <Page>
      <ConnectedAutomationList {...args} api={api} />
    </Page>
  );
};

export const EmptyStart = Template.bind({});

export const FewAutos = Template.bind({});
FewAutos.args = {
  ...FewAutos.args,
  initialAutomations: [
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
  ],
};

export const Loading: ComponentStory<any> = (args) => {
  const api = useMockApiService(args.initialAutomations);
  return (
    <Page>
      <ConnectedAutomationList
        {...args}
        api={{
          ...api,
          state: {
            automations: {
              ready: false,
            },
          },
        }}
      />
    </Page>
  );
};
