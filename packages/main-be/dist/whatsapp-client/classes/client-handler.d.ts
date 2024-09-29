import { AnyMessageContent, proto } from '@whiskeysockets/baileys';
import { Socket } from 'socket.io';
export declare class ClientHandler {
    private readonly _logger;
    private readonly _doReplies;
    private readonly _usePairingCode;
    private readonly _useStore;
    private readonly _msgRetryCounterCachce;
    private readonly _onDemandMap;
    private readonly _readLine;
    private readonly _store;
    private _wppSocket;
    private readonly _uid;
    private readonly _connectedClient;
    constructor(uid: string, connectedClient: Socket);
    createConnection(): Promise<{
        register: (code: string) => Promise<import("@whiskeysockets/baileys/lib/Socket/registration").ExistsResponse>;
        requestRegistrationCode: (registrationOptions?: import("@whiskeysockets/baileys/lib/Socket/registration").RegistrationOptions | undefined) => Promise<import("@whiskeysockets/baileys/lib/Socket/registration").ExistsResponse>;
        logger: import("pino").Logger<import("pino").LoggerOptions>;
        getOrderDetails: (orderId: string, tokenBase64: string) => Promise<import("@whiskeysockets/baileys").OrderDetails>;
        getCatalog: ({ jid, limit, cursor }: import("@whiskeysockets/baileys/lib/Types").GetCatalogOptions) => Promise<{
            products: import("@whiskeysockets/baileys/lib/Types").Product[];
            nextPageCursor: string | undefined;
        }>;
        getCollections: (jid?: string | undefined, limit?: number) => Promise<{
            collections: import("@whiskeysockets/baileys/lib/Types").CatalogCollection[];
        }>;
        productCreate: (create: import("@whiskeysockets/baileys/lib/Types").ProductCreate) => Promise<import("@whiskeysockets/baileys").Product>;
        productDelete: (productIds: string[]) => Promise<{
            deleted: number;
        }>;
        productUpdate: (productId: string, update: import("@whiskeysockets/baileys/lib/Types").ProductUpdate) => Promise<import("@whiskeysockets/baileys").Product>;
        sendMessageAck: ({ tag, attrs, content }: import("@whiskeysockets/baileys").BinaryNode) => Promise<void>;
        sendRetryRequest: (node: import("@whiskeysockets/baileys").BinaryNode, forceIncludeKeys?: boolean) => Promise<void>;
        rejectCall: (callId: string, callFrom: string) => Promise<void>;
        fetchMessageHistory: (count: number, oldestMsgKey: import("@whiskeysockets/baileys/lib/Types").WAProto.IMessageKey, oldestMsgTimestamp: number | import("long").Long) => Promise<string>;
        requestPlaceholderResend: (messageKey: import("@whiskeysockets/baileys/lib/Types").WAProto.IMessageKey) => Promise<string | undefined>;
        getPrivacyTokens: (jids: string[]) => Promise<import("@whiskeysockets/baileys").BinaryNode>;
        assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
        relayMessage: (jid: string, message: import("@whiskeysockets/baileys/lib/Types").WAProto.IMessage, { messageId: msgId, participant, additionalAttributes, additionalNodes, useUserDevicesCache, useCachedGroupMetadata, statusJidList }: import("@whiskeysockets/baileys/lib/Types").MessageRelayOptions) => Promise<string>;
        sendReceipt: (jid: string, participant: string | undefined, messageIds: string[], type: import("@whiskeysockets/baileys/lib/Types").MessageReceiptType) => Promise<void>;
        sendReceipts: (keys: import("@whiskeysockets/baileys/lib/Types").WAProto.IMessageKey[], type: import("@whiskeysockets/baileys/lib/Types").MessageReceiptType) => Promise<void>;
        readMessages: (keys: import("@whiskeysockets/baileys/lib/Types").WAProto.IMessageKey[]) => Promise<void>;
        refreshMediaConn: (forceGet?: boolean) => Promise<import("@whiskeysockets/baileys").MediaConnInfo>;
        waUploadToServer: import("@whiskeysockets/baileys").WAMediaUploadFunction;
        fetchPrivacySettings: (force?: boolean) => Promise<{
            [_: string]: string;
        }>;
        sendPeerDataOperationMessage: (pdoMessage: import("@whiskeysockets/baileys/lib/Types").WAProto.Message.IPeerDataOperationRequestMessage) => Promise<string>;
        createParticipantNodes: (jids: string[], message: import("@whiskeysockets/baileys/lib/Types").WAProto.IMessage, extraAttrs?: {
            [key: string]: string;
        } | undefined) => Promise<{
            nodes: import("@whiskeysockets/baileys").BinaryNode[];
            shouldIncludeDeviceIdentity: boolean;
        }>;
        getUSyncDevices: (jids: string[], useCache: boolean, ignoreZeroDevices: boolean) => Promise<import("@whiskeysockets/baileys").JidWithDevice[]>;
        updateMediaMessage: (message: import("@whiskeysockets/baileys/lib/Types").WAProto.IWebMessageInfo) => Promise<import("@whiskeysockets/baileys/lib/Types").WAProto.IWebMessageInfo>;
        sendMessage: (jid: string, content: import("@whiskeysockets/baileys/lib/Types").AnyMessageContent, options?: import("@whiskeysockets/baileys/lib/Types").MiscMessageGenerationOptions) => Promise<import("@whiskeysockets/baileys/lib/Types").WAProto.WebMessageInfo | undefined>;
        groupMetadata: (jid: string) => Promise<import("@whiskeysockets/baileys").GroupMetadata>;
        groupCreate: (subject: string, participants: string[]) => Promise<import("@whiskeysockets/baileys").GroupMetadata>;
        groupLeave: (id: string) => Promise<void>;
        groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
        groupRequestParticipantsList: (jid: string) => Promise<{
            [key: string]: string;
        }[]>;
        groupRequestParticipantsUpdate: (jid: string, participants: string[], action: "reject" | "approve") => Promise<{
            status: string;
            jid: string;
        }[]>;
        groupParticipantsUpdate: (jid: string, participants: string[], action: import("@whiskeysockets/baileys/lib/Types").ParticipantAction) => Promise<{
            status: string;
            jid: string;
            content: import("@whiskeysockets/baileys").BinaryNode;
        }[]>;
        groupUpdateDescription: (jid: string, description?: string | undefined) => Promise<void>;
        groupInviteCode: (jid: string) => Promise<string | undefined>;
        groupRevokeInvite: (jid: string) => Promise<string | undefined>;
        groupAcceptInvite: (code: string) => Promise<string | undefined>;
        groupRevokeInviteV4: (groupJid: string, invitedJid: string) => Promise<boolean>;
        groupAcceptInviteV4: (key: string | import("@whiskeysockets/baileys/lib/Types").WAProto.IMessageKey, inviteMessage: import("@whiskeysockets/baileys/lib/Types").WAProto.Message.IGroupInviteMessage) => Promise<string>;
        groupGetInviteInfo: (code: string) => Promise<import("@whiskeysockets/baileys").GroupMetadata>;
        groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
        groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
        groupMemberAddMode: (jid: string, mode: "all_member_add" | "admin_add") => Promise<void>;
        groupJoinApprovalMode: (jid: string, mode: "on" | "off") => Promise<void>;
        groupFetchAllParticipating: () => Promise<{
            [_: string]: import("@whiskeysockets/baileys/lib/Types").GroupMetadata;
        }>;
        processingMutex: {
            mutex<T>(code: () => T | Promise<T>): Promise<T>;
        };
        upsertMessage: (msg: import("@whiskeysockets/baileys/lib/Types").WAProto.IWebMessageInfo, type: import("@whiskeysockets/baileys/lib/Types").MessageUpsertType) => Promise<void>;
        appPatch: (patchCreate: import("@whiskeysockets/baileys/lib/Types").WAPatchCreate) => Promise<void>;
        sendPresenceUpdate: (type: import("@whiskeysockets/baileys/lib/Types").WAPresence, toJid?: string | undefined) => Promise<void>;
        presenceSubscribe: (toJid: string, tcToken?: Buffer | undefined) => Promise<void>;
        profilePictureUrl: (jid: string, type?: "image" | "preview", timeoutMs?: number | undefined) => Promise<string | undefined>;
        onWhatsApp: (...jids: string[]) => Promise<{
            exists: boolean;
            jid: string;
        }[]>;
        fetchBlocklist: () => Promise<string[]>;
        fetchStatus: (jid: string) => Promise<{
            status: string | undefined;
            setAt: Date;
        } | undefined>;
        updateProfilePicture: (jid: string, content: import("@whiskeysockets/baileys/lib/Types").WAMediaUpload) => Promise<void>;
        removeProfilePicture: (jid: string) => Promise<void>;
        updateProfileStatus: (status: string) => Promise<void>;
        updateProfileName: (name: string) => Promise<void>;
        updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
        updateCallPrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAPrivacyCallValue) => Promise<void>;
        updateLastSeenPrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAPrivacyValue) => Promise<void>;
        updateOnlinePrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAPrivacyOnlineValue) => Promise<void>;
        updateProfilePicturePrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAPrivacyValue) => Promise<void>;
        updateStatusPrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAPrivacyValue) => Promise<void>;
        updateReadReceiptsPrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAReadReceiptsValue) => Promise<void>;
        updateGroupsAddPrivacy: (value: import("@whiskeysockets/baileys/lib/Types").WAPrivacyGroupAddValue) => Promise<void>;
        updateDefaultDisappearingMode: (duration: number) => Promise<void>;
        getBusinessProfile: (jid: string) => Promise<void | import("@whiskeysockets/baileys").WABusinessProfile>;
        resyncAppState: (collections: readonly ("critical_block" | "critical_unblock_low" | "regular_high" | "regular_low" | "regular")[], isInitialSync: boolean) => Promise<void>;
        chatModify: (mod: import("@whiskeysockets/baileys/lib/Types").ChatModification, jid: string) => Promise<void>;
        cleanDirtyBits: (type: "account_sync" | "groups", fromTimestamp?: string | number | undefined) => Promise<void>;
        addChatLabel: (jid: string, labelId: string) => Promise<void>;
        removeChatLabel: (jid: string, labelId: string) => Promise<void>;
        addMessageLabel: (jid: string, messageId: string, labelId: string) => Promise<void>;
        removeMessageLabel: (jid: string, messageId: string, labelId: string) => Promise<void>;
        star: (jid: string, messages: {
            id: string;
            fromMe?: boolean | undefined;
        }[], star: boolean) => Promise<void>;
        type: "md";
        ws: any;
        ev: import("@whiskeysockets/baileys").BaileysEventEmitter & {
            process(handler: (events: Partial<import("@whiskeysockets/baileys").BaileysEventMap>) => void | Promise<void>): () => void;
            buffer(): void;
            createBufferedFunction<A extends any[], T_1>(work: (...args: A) => Promise<T_1>): (...args: A) => Promise<T_1>;
            flush(force?: boolean | undefined): boolean;
            isBuffering(): boolean;
        };
        authState: {
            creds: import("@whiskeysockets/baileys/lib/Types").AuthenticationCreds;
            keys: import("@whiskeysockets/baileys/lib/Types").SignalKeyStoreWithTransaction;
        };
        signalRepository: import("@whiskeysockets/baileys").SignalRepository;
        user: import("@whiskeysockets/baileys").Contact | undefined;
        generateMessageTag: () => string;
        query: (node: import("@whiskeysockets/baileys").BinaryNode, timeoutMs?: number | undefined) => Promise<import("@whiskeysockets/baileys").BinaryNode>;
        waitForMessage: <T_2>(msgId: string, timeoutMs?: number | undefined) => Promise<T_2>;
        waitForSocketOpen: () => Promise<void>;
        sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
        sendNode: (frame: import("@whiskeysockets/baileys").BinaryNode) => Promise<void>;
        logout: (msg?: string | undefined) => Promise<void>;
        end: (error: Error | undefined) => void;
        onUnexpectedError: (err: Error | import("@hapi/boom").Boom<any>, msg: string) => void;
        uploadPreKeys: (count?: number) => Promise<void>;
        uploadPreKeysToServerIfRequired: () => Promise<void>;
        requestPairingCode: (phoneNumber: string) => Promise<string>;
        waitForConnectionUpdate: (check: (u: Partial<import("@whiskeysockets/baileys").ConnectionState>) => boolean | undefined, timeoutMs?: number | undefined) => Promise<void>;
        sendWAMBuffer: (wamBuffer: Buffer) => Promise<import("@whiskeysockets/baileys").BinaryNode>;
    }>;
    private _question;
    private _getMessage;
}
