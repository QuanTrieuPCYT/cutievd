import { before, after } from "@vendetta/patcher"
// import { getAssetIDByName } from "@vendetta/ui/assets"
import { findByProps, findByName } from "@vendetta/metro"
import { React, ReactNative, constants as Constants, clipboard } from "@vendetta/metro/common"
/*
import { Forms } from "@vendetta/ui/components"
import { showToast } from "@vendetta/ui/toasts"
import { storage } from "@vendetta/plugin";
*/

const ActionSheet = findByProps("openLazy", "hideActionSheet")
/*
const Navigation = findByProps("push", "pushLazy", "pop")
const DiscordNavigator = findByProps("getRenderCloseButton")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator
const { FormRow, FormIcon } = Forms
*/

let patch = [];

const Main = {
    onLoad() {
        patch.push(
            before("openLazy", ActionSheet, (ctx) => {
                const [component, args, actionMessage] = ctx;
                if (args !== "MessageLongPressActionSheet") return;
                component.then((instance) => {
                    const unpatch = after("default", instance, (_, component) => {
                        React.useEffect(() => () => { unpatch() }, [])

                        let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children
                        const message = msgProps?.props?.message ?? actionMessage?.message
                        if (!buttons || !message) return;

                        let findReport = buttons.find(b => b?.props?.message?.toLowerCase() == 'report');
                        let findMarkUnread = buttons.find(b => b?.props?.message?.toLowerCase() == 'mark unread');
                        let findMention = buttons.find(b => b?.props?.message?.toLowerCase() == 'mention');
                        let findCopyMessageId = buttons.find(b => b?.props?.message?.toLowerCase() == 'copy message id');
                        let findMessageButton = buttons.find(b => b?.props?.message?.toLowerCase() == 'message');
                        let findJumpToReference = buttons.find(b => b?.props?.message?.toLowerCase() == 'jump to reference');
                        // let findCreateThread = buttons.find(b => b?.props?.message?.toLowerCase() == 'create thread');

                        if (findReport) delete buttons[buttons.indexOf(findReport)]
                        if (findMarkUnread) delete buttons[buttons.indexOf(findMarkUnread)]
                        if (findMention) delete buttons[buttons.indexOf(findMention)]
                        if (findCopyMessageId) delete buttons[buttons.indexOf(findCopyMessageId)]
                        if (findMessageButton) delete buttons[buttons.indexOf(findMessageButton)]
                        if (findJumpToReference) delete buttons[buttons.indexOf(findJumpToReference)]
                        // if (findCreateThread) delete buttons[buttons.indexOf(findCreateThread)]
                    }
                )})
            })
    )},
    onUnload() {
        patch.forEach(p => p?.());
    },
}

export default Main;