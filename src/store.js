/**
 * Created by djj on 2019/4/19.
 */
require('./api/hxwpapi-v3.2.4.min');
import extAPI from './api/hxucsext';
import router from './router/index.js'

const loginStateIdle = 0;
const loginStatePending = 1;
const loginStateOnline = 2;

const m_loginStates = {
    Idle: 0,
    Pending: 1,
    Online: 2
};

console.log("NODE_ENV=" + ((typeof process.env.NODE_ENV == 'undefined') ? "debug" : "release"));
const m_serverExt = ((typeof process.env.NODE_ENV !== 'undefined') ? window.location.origin : "https://ms.hxtester.top");
const m_serverWP = ((typeof process.env.NODE_ENV !== 'undefined') ? window.location.host : "ms.hxtester.top");


let m_wp = null;
let m_wpState = 0;

let m_loginState = m_loginStates.Idle;

function evtHdlrExtAPI(evt) {
    switch (evt.Evt) {
        case extAPI.EvtTypes.Offline:
            if (m_wp != null) {
                m_wp.logout();
            }
            m_loginState = m_loginStates.Idle;
            router.replace('/login');
            break;
    }
}

function evtHdlrWPAPI(e) {
    console.log("phone evt: " + JSON.stringify(e));
    switch (e.Evt) {
        case m_wp.EvtTypes.UpdateState:
            m_wpState = e.state;
            store.wpStates.state = e.state;
            store.wpStates.inCom = false;
            store.isCalling = m_wpState > m_wp.States.Idle;
            switch (e.state) {
                case m_wp.States.Offline:
                    wpClearState();
                    if (e.hasOwnProperty("server")) {
                    }
                    if (e.hasOwnProperty("user")) {
                        store.id = e.user;
                    }
                    if (e.hasOwnProperty("pwd")) {
                        store.pwd = e.pwd;
                    }
                    if (e.hasOwnProperty("alias")) {
                        store.alias = e.alias;
                    }
                    break;
                case m_wp.States.Login:
                    break;
                case m_wp.States.Idle:
                    wpClearState();
                    break;
                case m_wp.States.Init:
                    break;
                case m_wp.States.Alert:
                    store.wpStates.inCom = e.incoming;
                    if (e.incoming) {
                        store.wpStates.peerNumber = e.from;
                    }
                    break;
                case m_wp.States.Connected:
                    break;
            }
            break;
        case m_wp.EvtTypes.UpdateLocalVideo:
            store.wpStates.hasPreview = e.videoWidth > 8 && e.videoHeight > 8;
            break;
        case m_wp.EvtTypes.UpdateRemoteVideo:
            store.wpStates.hasVideo = e.videoWidth > 8 && e.videoHeight > 8;
            break;
        case m_wp.EvtTypes.UpdateMediaDeviceInfo:
            if (e.hasOwnProperty("micDevices")) {
                store.wpStates.mics = e.micDevices;
            }
            if (e.hasOwnProperty("defaultMicId")) {
                store.wpStates.defaultMic = e.defaultMicId;
            }
            if (e.hasOwnProperty("curMicId")) {
                store.wpStates.curMic = e.curMicId;
            }
            if (e.hasOwnProperty("enableMic")) {
                store.wpStates.enMic = e.enableMic;
            }
            if (e.hasOwnProperty("cameraDevices")) {
                store.wpStates.cameras = e.cameraDevices;
            }
            if (e.hasOwnProperty("defaultCameraId")) {
                store.wpStates.defaultCamera = e.defaultCameraId;
            }
            if (e.hasOwnProperty("curCameraId")) {
                store.wpStates.curCamera = e.curCameraId;
            }
            if (e.hasOwnProperty("enableCamera")) {
                store.wpStates.enCamera = e.enableCamera;
            }
            break;
    }
}

function wpClearState() {
    store.wpStates.peerName = "";
    store.wpStates.peerNumber = "";
    store.wpStates.inCom = false;
    store.wpStates.hasPreview = false;
    store.wpStates.hasVideo = false;
    store.wpStates.curCamera = "";
    store.wpStates.enCamera = false;
    store.wpStates.curMic = "";
    store.wpStates.enMic = false;
}

global.HxUCSNumberTypeNames = [
    "内线分机",
    "调度台",
    "外线固话",
    "手机",
    "一号通",
    "铃组",
    "会议组",
    "集群对讲组",
    "摄像头"
];

const store = {
    id: "",
    pwd: "",
    alias: "",
    isCalling: false,
    wp(){
        return m_wp;
    },
    wpStates: {
        peerName: "",
        peerNumber: "",
        state: 0,
        inCom: false,
        hasPreview: false,
        hasVideo: false,
        cameras: [],
        defaultCamera: "",
        curCamera: "",
        enCamera: false,
        mics: [],
        defaultMic: "",
        curMic: "",
        enMic: false,
    },
    loginStates(){
        return m_loginStates;
    },
    createWP(previewEle, remoteEle){
        m_wp = new HxWebPhone(previewEle, remoteEle, evtHdlrWPAPI);
        return m_wp;
    },
    login(id, pwd, alias){
        return new Promise(function (onFulfilled, onRejected) {
            if (m_wp == null) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "软电话未初始化"
                });
                return;
            }
            if (m_loginState != m_loginStates.Idle) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "重复登录"
                });
                return;
            }
            m_loginState = m_loginStates.Pending;
            extAPI.account.login(m_serverExt, id, pwd, evtHdlrExtAPI).then(
                () => {
                    if (m_loginState == m_loginStates.Idle) {
                        onRejected({
                            ErrNo: -1,
                            ErrMsg: "放弃登录"
                        });
                        return;
                    }
                    return m_wp.login(m_serverWP, id, pwd, alias, evtHdlrWPAPI);
                }
            ).catch((e) => {
                console.log("err1: " + e);
                m_loginState = m_loginStates.Idle;
                if (e.hasOwnProperty("ErrMsg")) {
                    onRejected(e);
                } else {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: e.toString()
                    });
                }
            }).then(() => {
                if (m_loginState == m_loginStates.Idle) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "放弃登录"
                    });
                    return;
                }
                router.replace("/");
                m_loginState = m_loginStates.Online;
                onFulfilled();
            }).catch((e) => {
                console.log("err2: " + e);
                m_loginState = m_loginStates.Idle;
                extAPI.account.logout();
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "软电话登录失败: " + e
                });
            });
        });
    },
    logout(){
        if (m_loginState == m_loginStates.Idle) {
            return;
        }
        m_loginState = m_loginStates.Idle;
        extAPI.account.logout();
        if (m_wp != null) {
            m_wp.logout();
        }
        router.replace("/login");
    }
};

export default store;