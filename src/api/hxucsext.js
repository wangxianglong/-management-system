/**
 * Created by djj on 2019/4/17.
 */
"use strict";

import ajax  from "./util/ajax";

let timer = null;

const EvtTypes = {
    Offline: 0
};

const state = {
    login: false,
    online: false,
    server: ""
};

let evtHandler = null;

function pollEvents() {
    if (!state.online) {
        return;
    }
    ajax.makeAjaxRequest({
        method: "GET",
        url: state.server + "/extension/poll",
    }).then(function (response) {
        if (!state.online) {
            return;
        }
        if (!response) {
            return;
        }
        let events = JSON.parse(response);
        events.forEach(function (evt) {
            evtHandler(evt);
        })
    }).catch(function (e) {
        if (!state.online) {
            return;
        }
        state.online = false;
        evtHandler({
            Evt: EvtTypes.Offline
        });
    })
}

const account = {
    login(pserver, extensionID, password, pevtHdler){
        return new Promise(function (onFulfilled, onRejected) {
            if (state.login || state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "logout first"
                });
                return;
            }
            state.login = true;
            ajax.makeAjaxRequest({
                method: "POST",
                url: pserver + "/extension/login",
                // headers: {
                //     'Content-type': 'application/x-www-form-urlencoded',
                // },
                form: {
                    id: extensionID,
                    pwd: password
                }
            }).then(function (response) {
                if (!state.login) {
                    return;
                }
                console.log("log succ 1");
                state.login = false;
                if (response) {
                    let ret = JSON.parse(response);
                    if (ret.ErrNo != 0) {
                        onRejected(ret);
                        return;
                    }
                }
                evtHandler = pevtHdler;
                state.online = true;
                state.server = pserver;
                console.log("log succ 2");
                timer = setInterval(pollEvents, 6000);
                console.log("log succ 3");
                onFulfilled();
            }).catch(function (e) {
                if (!state.login && !state.online) {
                    return;
                }
                state.online = false;
                state.login = false;
                onRejected(e);
            });
        });
    },
    logout(){
        if (state.online || state.login) {
            evtHandler = null;
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/logout",
            });
            state.login = false;
            state.online = false;
        }
    },
    setPassword (oldPwd, newPwd) {
        return new Promise(function (onFulfilled, onRejected) {
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/setpwd",
                form: {
                    oldPwd: oldPwd,
                    newPwd: newPwd
                }
            }).then(function (response) {
                if (response) {
                    let ret = JSON.parse(response);
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    setProfile (extensionProfile) {
        return new Promise(function (onFulfilled, onRejected) {
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/setProfile",
                form: {
                    profile: extensionProfile
                }
            }).then(function (response) {
                if (response) {
                    let ret = JSON.parse(response);
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    getProfile(){

    },
    state: state
};

const phoneBook = {
    contactList(filter, offset, limit){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/contactlist",
                form: {
                    filter: filter,
                    offset: offset,
                    limit: limit
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled([ret.List, ret.Total]);
            }).catch(onRejected);
        });
    },
    contactAdd(contact){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/contactAdd",
                form: {
                    contact: JSON.stringify(contact)
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled(ret.indexes);
            }).catch(onRejected);
        });
    },
    contactUpdate(contact){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/contactUpdate",
                form: {
                    contact: JSON.stringify(contact)
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    contactRmv(idxContacts){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    status: -1,
                    statusText: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/contactRmv",
                form: {
                    indexes: idxContacts
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    groupList(filter, offset, limit){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/groupList",
                form: {
                    filter: filter,
                    offset: offset,
                    limit: limit
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled([ret.List, ret.Total]);
            }).catch(onRejected);
        });
    },
    groupAdd(groups){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/groupAdd",
                form: {
                    groups: JSON.stringify(groups)
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled(ret.indexes);
            }).catch(onRejected);
        });
    },
    groupRmv(idxGroups){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    status: -1,
                    statusText: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/groupRmv",
                form: {
                    indexes: idxGroups
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    groupListContacts(idxGroup){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/groupListContacts",
                form: {
                    idxGroup: idxGroup
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled(ret.List);
            }).catch(onRejected);
        });
    },
    groupAddContacts(idxGroup, idxContacts){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/groupAddContacts",
                form: {
                    idxGroup: idxGroup,
                    idxContacts: JSON.stringify(idxContacts)
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    groupRmvContacts(idxGroup, idxContacts){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/pb/groupRmvContacts",
                form: {
                    idxGroup: idxGroup,
                    idxContacts: JSON.stringify(idxContacts)
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    }
};

const callLog = {
    list(filter, offset, limit){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    ErrNo: -1,
                    ErrMsg: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/callLog/list",
                form: {
                    filter: filter,
                    offset: offset,
                    limit: limit
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled([ret.List, ret.Total]);
            }).catch(onRejected);
        });
    },
    remove(filter){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    status: -1,
                    statusText: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/callLog/remove",
                form: {
                    filter: filter
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    },
    removeByIndexes(indexes){
        return new Promise(function (onFulfilled, onRejected) {
            if (!state.online) {
                onRejected({
                    status: -1,
                    statusText: "login first"
                });
                return;
            }
            ajax.makeAjaxRequest({
                method: "POST",
                url: state.server + "/extension/callLog/remove",
                form: {
                    indexes: indexes
                }
            }).then(function (response) {
                if (!response) {
                    onRejected({
                        ErrNo: -1,
                        ErrMsg: "Invalid return format"
                    });
                    return;
                }
                let ret = JSON.parse(response);
                if (ret.ErrNo != 0) {
                    onRejected(ret);
                    return;
                }
                onFulfilled();
            }).catch(onRejected);
        });
    }
};

const extension = {
    EvtTypes,
    account,
    phoneBook,
    callLog
};

export default extension;