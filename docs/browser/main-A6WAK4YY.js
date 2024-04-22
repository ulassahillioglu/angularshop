var SC = Object.defineProperty,
  IC = Object.defineProperties;
var MC = Object.getOwnPropertyDescriptors;
var zs = Object.getOwnPropertySymbols;
var Eg = Object.prototype.hasOwnProperty,
  Sg = Object.prototype.propertyIsEnumerable;
var _g = (t, e, r) =>
    e in t
      ? SC(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  I = (t, e) => {
    for (var r in (e ||= {})) Eg.call(e, r) && _g(t, r, e[r]);
    if (zs) for (var r of zs(e)) Sg.call(e, r) && _g(t, r, e[r]);
    return t;
  },
  te = (t, e) => IC(t, MC(e));
var qs = (t, e) => {
  var r = {};
  for (var n in t) Eg.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && zs)
    for (var n of zs(t)) e.indexOf(n) < 0 && Sg.call(t, n) && (r[n] = t[n]);
  return r;
};
var Ig = null;
var fu = 1,
  hu = Symbol("SIGNAL");
function xt(t) {
  let e = Ig;
  return (Ig = t), e;
}
var Mg = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function TC(t) {
  if (!(mu(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === fu)) {
    if (!t.producerMustRecompute(t) && !pu(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = fu);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = fu);
  }
}
function Tg(t) {
  return t && (t.nextProducerIndex = 0), xt(t);
}
function xg(t, e) {
  if (
    (xt(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (mu(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        gu(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function pu(t) {
  Gs(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (TC(r), n !== r.version)) return !0;
  }
  return !1;
}
function Ag(t) {
  if ((Gs(t), mu(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      gu(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function gu(t, e) {
  if ((xC(t), Gs(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      gu(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    Gs(i), (i.producerIndexOfThis[n] = e);
  }
}
function mu(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Gs(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function xC(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function AC() {
  throw new Error();
}
var NC = AC;
function Ng(t) {
  NC = t;
}
function L(t) {
  return typeof t == "function";
}
function fi(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var Ws = fi(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function Nr(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var Ne = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (L(n))
        try {
          n();
        } catch (o) {
          e = o instanceof Ws ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Og(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof Ws ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Ws(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) Og(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && Nr(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && Nr(r, e), e instanceof t && e._removeParent(this);
  }
};
Ne.EMPTY = (() => {
  let t = new Ne();
  return (t.closed = !0), t;
})();
var vu = Ne.EMPTY;
function Qs(t) {
  return (
    t instanceof Ne ||
    (t && "closed" in t && L(t.remove) && L(t.add) && L(t.unsubscribe))
  );
}
function Og(t) {
  L(t) ? t() : t.unsubscribe();
}
var Jt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var hi = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = hi;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = hi;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Ks(t) {
  hi.setTimeout(() => {
    let { onUnhandledError: e } = Jt;
    if (e) e(t);
    else throw t;
  });
}
function Or() {}
var Pg = yu("C", void 0, void 0);
function Rg(t) {
  return yu("E", void 0, t);
}
function Fg(t) {
  return yu("N", t, void 0);
}
function yu(t, e, r) {
  return { kind: t, value: e, error: r };
}
var Pr = null;
function pi(t) {
  if (Jt.useDeprecatedSynchronousErrorHandling) {
    let e = !Pr;
    if ((e && (Pr = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = Pr;
      if (((Pr = null), r)) throw n;
    }
  } else t();
}
function kg(t) {
  Jt.useDeprecatedSynchronousErrorHandling &&
    Pr &&
    ((Pr.errorThrown = !0), (Pr.error = t));
}
var Rr = class extends Ne {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Qs(e) && e.add(this))
          : (this.destination = RC);
    }
    static create(e, r, n) {
      return new gi(e, r, n);
    }
    next(e) {
      this.isStopped ? wu(Fg(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? wu(Rg(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? wu(Pg, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  OC = Function.prototype.bind;
function Du(t, e) {
  return OC.call(t, e);
}
var bu = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          Ys(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          Ys(n);
        }
      else Ys(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          Ys(r);
        }
    }
  },
  gi = class extends Rr {
    constructor(e, r, n) {
      super();
      let i;
      if (L(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Jt.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Du(e.next, o),
              error: e.error && Du(e.error, o),
              complete: e.complete && Du(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new bu(i);
    }
  };
function Ys(t) {
  Jt.useDeprecatedSynchronousErrorHandling ? kg(t) : Ks(t);
}
function PC(t) {
  throw t;
}
function wu(t, e) {
  let { onStoppedNotification: r } = Jt;
  r && hi.setTimeout(() => r(t, e));
}
var RC = { closed: !0, next: Or, error: PC, complete: Or };
var mi = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function At(t) {
  return t;
}
function Cu(...t) {
  return _u(t);
}
function _u(t) {
  return t.length === 0
    ? At
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var Z = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = kC(r) ? r : new gi(r, n, i);
      return (
        pi(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Lg(n)),
        new n((i, o) => {
          let s = new gi({
            next: (a) => {
              try {
                r(a);
              } catch (l) {
                o(l), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [mi]() {
      return this;
    }
    pipe(...r) {
      return _u(r)(this);
    }
    toPromise(r) {
      return (
        (r = Lg(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Lg(t) {
  var e;
  return (e = t ?? Jt.Promise) !== null && e !== void 0 ? e : Promise;
}
function FC(t) {
  return t && L(t.next) && L(t.error) && L(t.complete);
}
function kC(t) {
  return (t && t instanceof Rr) || (FC(t) && Qs(t));
}
function Eu(t) {
  return L(t?.lift);
}
function W(t) {
  return (e) => {
    if (Eu(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function K(t, e, r, n, i) {
  return new Su(t, e, r, n, i);
}
var Su = class extends Rr {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (l) {
              e.error(l);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (l) {
              e.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function vi() {
  return W((t, e) => {
    let r = null;
    t._refCount++;
    let n = K(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var yi = class extends Z {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Eu(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new Ne();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          K(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = Ne.EMPTY));
    }
    return e;
  }
  refCount() {
    return vi()(this);
  }
};
var Vg = fi(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var ce = (() => {
    class t extends Z {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new Zs(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Vg();
      }
      next(r) {
        pi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        pi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        pi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? vu
          : ((this.currentObservers = null),
            o.push(r),
            new Ne(() => {
              (this.currentObservers = null), Nr(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new Z();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new Zs(e, r)), t;
  })(),
  Zs = class extends ce {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : vu;
    }
  };
var nt = class extends ce {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Iu = {
  now() {
    return (Iu.delegate || Date).now();
  },
  delegate: void 0,
};
var Js = class extends Ne {
  constructor(e, r) {
    super();
  }
  schedule(e, r = 0) {
    return this;
  }
};
var yo = {
  setInterval(t, e, ...r) {
    let { delegate: n } = yo;
    return n?.setInterval ? n.setInterval(t, e, ...r) : setInterval(t, e, ...r);
  },
  clearInterval(t) {
    let { delegate: e } = yo;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Xs = class extends Js {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r), (this.pending = !1);
  }
  schedule(e, r = 0) {
    var n;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, r)),
      (this.pending = !0),
      (this.delay = r),
      (this.id =
        (n = this.id) !== null && n !== void 0
          ? n
          : this.requestAsyncId(o, this.id, r)),
      this
    );
  }
  requestAsyncId(e, r, n = 0) {
    return yo.setInterval(e.flush.bind(e, this), n);
  }
  recycleAsyncId(e, r, n = 0) {
    if (n != null && this.delay === n && this.pending === !1) return r;
    r != null && yo.clearInterval(r);
  }
  execute(e, r) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let n = this._execute(e, r);
    if (n) return n;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, r) {
    let n = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (n = !0), (i = o || new Error("Scheduled action threw falsy error"));
    }
    if (n) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: r } = this,
        { actions: n } = r;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Nr(n, this),
        e != null && (this.id = this.recycleAsyncId(r, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var Di = class t {
  constructor(e, r = t.now) {
    (this.schedulerActionCtor = e), (this.now = r);
  }
  schedule(e, r = 0, n) {
    return new this.schedulerActionCtor(this, e).schedule(n, r);
  }
};
Di.now = Iu.now;
var ea = class extends Di {
  constructor(e, r = Di.now) {
    super(e, r), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: r } = this;
    if (this._active) {
      r.push(e);
      return;
    }
    let n;
    this._active = !0;
    do if ((n = e.execute(e.state, e.delay))) break;
    while ((e = r.shift()));
    if (((this._active = !1), n)) {
      for (; (e = r.shift()); ) e.unsubscribe();
      throw n;
    }
  }
};
var Mu = new ea(Xs),
  jg = Mu;
var gt = new Z((t) => t.complete());
function ta(t) {
  return t && L(t.schedule);
}
function Tu(t) {
  return t[t.length - 1];
}
function na(t) {
  return L(Tu(t)) ? t.pop() : void 0;
}
function gn(t) {
  return ta(Tu(t)) ? t.pop() : void 0;
}
function $g(t, e) {
  return typeof Tu(t) == "number" ? t.pop() : e;
}
function Ug(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(u) {
      try {
        c(n.next(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      try {
        c(n.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      u.done ? o(u.value) : i(u.value).then(a, l);
    }
    c((n = n.apply(t, e || [])).next());
  });
}
function Bg(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Fr(t) {
  return this instanceof Fr ? ((this.v = t), this) : new Fr(t);
}
function Hg(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(p) {
    n[p] &&
      (i[p] = function (g) {
        return new Promise(function (v, S) {
          o.push([p, g, v, S]) > 1 || a(p, g);
        });
      });
  }
  function a(p, g) {
    try {
      l(n[p](g));
    } catch (v) {
      d(o[0][3], v);
    }
  }
  function l(p) {
    p.value instanceof Fr
      ? Promise.resolve(p.value.v).then(c, u)
      : d(o[0][2], p);
  }
  function c(p) {
    a("next", p);
  }
  function u(p) {
    a("throw", p);
  }
  function d(p, g) {
    p(g), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function zg(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof Bg == "function" ? Bg(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, l) {
          (s = t[o](s)), i(a, l, s.done, s.value);
        });
      };
  }
  function i(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var wi = (t) => t && typeof t.length == "number" && typeof t != "function";
function ra(t) {
  return L(t?.then);
}
function ia(t) {
  return L(t[mi]);
}
function oa(t) {
  return Symbol.asyncIterator && L(t?.[Symbol.asyncIterator]);
}
function sa(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function LC() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var aa = LC();
function la(t) {
  return L(t?.[aa]);
}
function ca(t) {
  return Hg(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Fr(r.read());
        if (i) return yield Fr(void 0);
        yield yield Fr(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function ua(t) {
  return L(t?.getReader);
}
function pe(t) {
  if (t instanceof Z) return t;
  if (t != null) {
    if (ia(t)) return VC(t);
    if (wi(t)) return jC(t);
    if (ra(t)) return $C(t);
    if (oa(t)) return qg(t);
    if (la(t)) return BC(t);
    if (ua(t)) return UC(t);
  }
  throw sa(t);
}
function VC(t) {
  return new Z((e) => {
    let r = t[mi]();
    if (L(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function jC(t) {
  return new Z((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function $C(t) {
  return new Z((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, Ks);
  });
}
function BC(t) {
  return new Z((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function qg(t) {
  return new Z((e) => {
    HC(t, e).catch((r) => e.error(r));
  });
}
function UC(t) {
  return qg(ca(t));
}
function HC(t, e) {
  var r, n, i, o;
  return Ug(this, void 0, void 0, function* () {
    try {
      for (r = zg(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function mt(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function da(t, e = 0) {
  return W((r, n) => {
    r.subscribe(
      K(
        n,
        (i) => mt(n, t, () => n.next(i), e),
        () => mt(n, t, () => n.complete(), e),
        (i) => mt(n, t, () => n.error(i), e)
      )
    );
  });
}
function fa(t, e = 0) {
  return W((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function Gg(t, e) {
  return pe(t).pipe(fa(e), da(e));
}
function Wg(t, e) {
  return pe(t).pipe(fa(e), da(e));
}
function Qg(t, e) {
  return new Z((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Kg(t, e) {
  return new Z((r) => {
    let n;
    return (
      mt(r, e, () => {
        (n = t[aa]()),
          mt(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => L(n?.return) && n.return()
    );
  });
}
function ha(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new Z((r) => {
    mt(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      mt(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Yg(t, e) {
  return ha(ca(t), e);
}
function Zg(t, e) {
  if (t != null) {
    if (ia(t)) return Gg(t, e);
    if (wi(t)) return Qg(t, e);
    if (ra(t)) return Wg(t, e);
    if (oa(t)) return ha(t, e);
    if (la(t)) return Kg(t, e);
    if (ua(t)) return Yg(t, e);
  }
  throw sa(t);
}
function se(t, e) {
  return e ? Zg(t, e) : pe(t);
}
function P(...t) {
  let e = gn(t);
  return se(t, e);
}
function Ke(t, e) {
  let r = L(t) ? t : () => t,
    n = (i) => i.error(r());
  return new Z(e ? (i) => e.schedule(n, 0, i) : n);
}
function xu(t) {
  return !!t && (t instanceof Z || (L(t.lift) && L(t.subscribe)));
}
var Rn = fi(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Jg(t) {
  return t instanceof Date && !isNaN(t);
}
function F(t, e) {
  return W((r, n) => {
    let i = 0;
    r.subscribe(
      K(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: zC } = Array;
function qC(t, e) {
  return zC(e) ? t(...e) : t(e);
}
function bi(t) {
  return F((e) => qC(t, e));
}
var { isArray: GC } = Array,
  { getPrototypeOf: WC, prototype: QC, keys: KC } = Object;
function pa(t) {
  if (t.length === 1) {
    let e = t[0];
    if (GC(e)) return { args: e, keys: null };
    if (YC(e)) {
      let r = KC(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function YC(t) {
  return t && typeof t == "object" && WC(t) === QC;
}
function ga(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function Do(...t) {
  let e = gn(t),
    r = na(t),
    { args: n, keys: i } = pa(t);
  if (n.length === 0) return se([], e);
  let o = new Z(ZC(n, e, i ? (s) => ga(i, s) : At));
  return r ? o.pipe(bi(r)) : o;
}
function ZC(t, e, r = At) {
  return (n) => {
    Xg(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let l = 0; l < i; l++)
          Xg(
            e,
            () => {
              let c = se(t[l], e),
                u = !1;
              c.subscribe(
                K(
                  n,
                  (d) => {
                    (o[l] = d), u || ((u = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function Xg(t, e, r) {
  t ? mt(r, t, e) : e();
}
function em(t, e, r, n, i, o, s, a) {
  let l = [],
    c = 0,
    u = 0,
    d = !1,
    p = () => {
      d && !l.length && !c && e.complete();
    },
    g = (S) => (c < n ? v(S) : l.push(S)),
    v = (S) => {
      o && e.next(S), c++;
      let x = !1;
      pe(r(S, u++)).subscribe(
        K(
          e,
          (T) => {
            i?.(T), o ? g(T) : e.next(T);
          },
          () => {
            x = !0;
          },
          void 0,
          () => {
            if (x)
              try {
                for (c--; l.length && c < n; ) {
                  let T = l.shift();
                  s ? mt(e, s, () => v(T)) : v(T);
                }
                p();
              } catch (T) {
                e.error(T);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      K(e, g, () => {
        (d = !0), p();
      })
    ),
    () => {
      a?.();
    }
  );
}
function we(t, e, r = 1 / 0) {
  return L(e)
    ? we((n, i) => F((o, s) => e(n, o, i, s))(pe(t(n, i))), r)
    : (typeof e == "number" && (r = e), W((n, i) => em(n, i, t, r)));
}
function mn(t = 1 / 0) {
  return we(At, t);
}
function tm() {
  return mn(1);
}
function tr(...t) {
  return tm()(se(t, gn(t)));
}
function ma(t) {
  return new Z((e) => {
    pe(t()).subscribe(e);
  });
}
function Au(...t) {
  let e = na(t),
    { args: r, keys: n } = pa(t),
    i = new Z((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        pe(r[u]).subscribe(
          K(
            o,
            (p) => {
              d || ((d = !0), c--), (a[u] = p);
            },
            () => l--,
            void 0,
            () => {
              (!l || !d) && (c || o.next(n ? ga(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(bi(e)) : i;
}
var JC = ["addListener", "removeListener"],
  XC = ["addEventListener", "removeEventListener"],
  e_ = ["on", "off"];
function wo(t, e, r, n) {
  if ((L(r) && ((n = r), (r = void 0)), n)) return wo(t, e, r).pipe(bi(n));
  let [i, o] = r_(t)
    ? XC.map((s) => (a) => t[s](e, a, r))
    : t_(t)
    ? JC.map(nm(t, e))
    : n_(t)
    ? e_.map(nm(t, e))
    : [];
  if (!i && wi(t)) return we((s) => wo(s, e, r))(pe(t));
  if (!i) throw new TypeError("Invalid event target");
  return new Z((s) => {
    let a = (...l) => s.next(1 < l.length ? l : l[0]);
    return i(a), () => o(a);
  });
}
function nm(t, e) {
  return (r) => (n) => t[r](e, n);
}
function t_(t) {
  return L(t.addListener) && L(t.removeListener);
}
function n_(t) {
  return L(t.on) && L(t.off);
}
function r_(t) {
  return L(t.addEventListener) && L(t.removeEventListener);
}
function rm(t = 0, e, r = jg) {
  let n = -1;
  return (
    e != null && (ta(e) ? (r = e) : (n = e)),
    new Z((i) => {
      let o = Jg(t) ? +t - r.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return r.schedule(function () {
        i.closed ||
          (i.next(s++), 0 <= n ? this.schedule(void 0, n) : i.complete());
      }, o);
    })
  );
}
function Xt(...t) {
  let e = gn(t),
    r = $g(t, 1 / 0),
    n = t;
  return n.length ? (n.length === 1 ? pe(n[0]) : mn(r)(se(n, e))) : gt;
}
function Oe(t, e) {
  return W((r, n) => {
    let i = 0;
    r.subscribe(K(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function ge(t) {
  return W((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      K(r, void 0, void 0, (s) => {
        (o = pe(t(s, ge(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function va(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      l = e,
      c = 0;
    o.subscribe(
      K(
        s,
        (u) => {
          let d = c++;
          (l = a ? t(l, u, d) : ((a = !0), u)), n && s.next(l);
        },
        i &&
          (() => {
            a && s.next(l), s.complete();
          })
      )
    );
  };
}
function im(t, e) {
  return W(va(t, e, arguments.length >= 2, !1, !0));
}
var i_ = (t, e) => (t.push(e), t);
function Nu() {
  return W((t, e) => {
    im(i_, [])(t).subscribe(e);
  });
}
function Fn(t, e) {
  return L(e) ? we(t, e, 1) : we(t, 1);
}
function nr(t) {
  return W((e, r) => {
    let n = !1;
    e.subscribe(
      K(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function at(t) {
  return t <= 0
    ? () => gt
    : W((e, r) => {
        let n = 0;
        e.subscribe(
          K(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function om() {
  return W((t, e) => {
    t.subscribe(K(e, Or));
  });
}
function bo(t) {
  return F(() => t);
}
function Ou(t, e) {
  return e
    ? (r) => tr(e.pipe(at(1), om()), r.pipe(Ou(t)))
    : we((r, n) => pe(t(r, n)).pipe(at(1), bo(r)));
}
function Pu(t, e = Mu) {
  let r = rm(t, e);
  return Ou(() => r);
}
function ya(t = o_) {
  return W((e, r) => {
    let n = !1;
    e.subscribe(
      K(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function o_() {
  return new Rn();
}
function rr(t) {
  return W((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function Ve(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? Oe((i, o) => t(i, o, n)) : At,
      at(1),
      r ? nr(e) : ya(() => new Rn())
    );
}
function Ci(t) {
  return t <= 0
    ? () => gt
    : W((e, r) => {
        let n = [];
        e.subscribe(
          K(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function Ru(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? Oe((i, o) => t(i, o, n)) : At,
      Ci(1),
      r ? nr(e) : ya(() => new Rn())
    );
}
function Fu(t, e) {
  return W(va(t, e, arguments.length >= 2, !0));
}
function Da(t) {
  return Oe((e, r) => t <= r);
}
function ku(...t) {
  let e = gn(t);
  return W((r, n) => {
    (e ? tr(t, r, e) : tr(t, r)).subscribe(n);
  });
}
function je(t, e) {
  return W((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      K(
        n,
        (l) => {
          i?.unsubscribe();
          let c = 0,
            u = o++;
          pe(t(l, u)).subscribe(
            (i = K(
              n,
              (d) => n.next(e ? e(l, d, u, c++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Lu(t) {
  return W((e, r) => {
    pe(t).subscribe(K(r, () => r.complete(), Or)), !r.closed && e.subscribe(r);
  });
}
function N(t, e, r) {
  let n = L(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? W((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          K(
            o,
            (l) => {
              var c;
              (c = n.next) === null || c === void 0 || c.call(n, l), o.next(l);
            },
            () => {
              var l;
              (a = !1),
                (l = n.complete) === null || l === void 0 || l.call(n),
                o.complete();
            },
            (l) => {
              var c;
              (a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, l),
                o.error(l);
            },
            () => {
              var l, c;
              a && ((l = n.unsubscribe) === null || l === void 0 || l.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n);
            }
          )
        );
      })
    : At;
}
var Zm = "https://g.co/ng/security#xss",
  b = class extends Error {
    constructor(e, r) {
      super(sl(e, r)), (this.code = e);
    }
  };
function sl(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var nd = class extends ce {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let l = e;
      (i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
    }
    this.__isAsync && ((o = Vu(o)), i && (i = Vu(i)), s && (s = Vu(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof Ne && e.add(a), a;
  }
};
function Vu(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var ae = nd;
var Y = (function (t) {
  return (
    (t[(t.Default = 0)] = "Default"),
    (t[(t.Host = 1)] = "Host"),
    (t[(t.Self = 2)] = "Self"),
    (t[(t.SkipSelf = 4)] = "SkipSelf"),
    (t[(t.Optional = 8)] = "Optional"),
    t
  );
})(Y || {});
function ct(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(ct).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function sm(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var Jm = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Jm || {}),
  Dn = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(Dn || {});
function ko(t) {
  return { toString: t }.toString();
}
var Pe = globalThis;
var xi = {},
  Nt = [];
function de(t) {
  for (let e in t) if (t[e] === de) return e;
  throw Error("Could not find renamed property on target object.");
}
function a_(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
var l_ = de({ ɵcmp: de }),
  c_ = de({ ɵdir: de }),
  u_ = de({ ɵpipe: de }),
  d_ = de({ ɵmod: de }),
  Fa = de({ ɵfac: de }),
  _o = de({ __NG_ELEMENT_ID__: de }),
  am = de({ __NG_ENV_ID__: de }),
  Re = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(Re || {});
function Xm(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function rd(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      f_(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function ev(t) {
  return t === 3 || t === 4 || t === 6;
}
function f_(t) {
  return t.charCodeAt(0) === 64;
}
function So(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? lm(t, r, i, null, e[++n])
              : lm(t, r, i, null, null));
      }
    }
  return t;
}
function lm(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var tv = "ng-template";
function h_(t, e, r) {
  let n = 0,
    i = !0;
  for (; n < t.length; ) {
    let o = t[n++];
    if (typeof o == "string" && i) {
      let s = t[n++];
      if (r && o === "class" && Xm(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; n < t.length && typeof (o = t[n++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function nv(t) {
  return t.type === 4 && t.value !== tv;
}
function p_(t, e, r) {
  let n = t.type === 4 && !r ? tv : t.value;
  return e === n;
}
function g_(t, e, r) {
  let n = 4,
    i = t.attrs || [],
    o = y_(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let l = e[a];
    if (typeof l == "number") {
      if (!s && !en(n) && !en(l)) return !1;
      if (s && en(l)) continue;
      (s = !1), (n = l | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (l !== "" && !p_(t, l, r)) || (l === "" && e.length === 1))
        ) {
          if (en(n)) return !1;
          s = !0;
        }
      } else {
        let c = n & 8 ? l : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!h_(t.attrs, c, r)) {
            if (en(n)) return !1;
            s = !0;
          }
          continue;
        }
        let u = n & 8 ? "class" : l,
          d = m_(u, i, nv(t), r);
        if (d === -1) {
          if (en(n)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let p;
          d > o ? (p = "") : (p = i[d + 1].toLowerCase());
          let g = n & 8 ? p : null;
          if ((g && Xm(g, c, 0) !== -1) || (n & 2 && c !== p)) {
            if (en(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return en(n) || s;
}
function en(t) {
  return (t & 1) === 0;
}
function m_(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return D_(e, t);
}
function v_(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (g_(t, e[n], r)) return !0;
  return !1;
}
function y_(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (ev(r)) return e;
  }
  return t.length;
}
function D_(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function cm(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function w_(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !en(s) && ((e += cm(o, i)), (i = "")),
        (n = s),
        (o = o || !en(n));
    r++;
  }
  return i !== "" && (e += cm(o, i)), e;
}
function b_(t) {
  return t.map(w_).join(",");
}
function C_(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!en(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function re(t) {
  return ko(() => {
    let e = av(t),
      r = te(I({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Jm.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Dn.Emulated,
        styles: t.styles || Nt,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    lv(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = dm(n, !1)), (r.pipeDefs = dm(n, !0)), (r.id = S_(r)), r
    );
  });
}
function __(t) {
  return sr(t) || rv(t);
}
function E_(t) {
  return t !== null;
}
function Fe(t) {
  return ko(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Nt,
    declarations: t.declarations || Nt,
    imports: t.imports || Nt,
    exports: t.exports || Nt,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function um(t, e) {
  if (t == null) return xi;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = Re.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== Re.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function ue(t) {
  return ko(() => {
    let e = av(t);
    return lv(e), e;
  });
}
function Lo(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function sr(t) {
  return t[l_] || null;
}
function rv(t) {
  return t[c_] || null;
}
function iv(t) {
  return t[u_] || null;
}
function ov(t) {
  let e = sr(t) || rv(t) || iv(t);
  return e !== null ? e.standalone : !1;
}
function sv(t, e) {
  let r = t[d_] || null;
  if (!r && e === !0)
    throw new Error(`Type ${ct(t)} does not have '\u0275mod' property.`);
  return r;
}
function av(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || xi,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Nt,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: um(t.inputs, e),
    outputs: um(t.outputs),
    debugInfo: null,
  };
}
function lv(t) {
  t.features?.forEach((e) => e(t));
}
function dm(t, e) {
  if (!t) return null;
  let r = e ? iv : __;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(E_);
}
function S_(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
var Ot = 0,
  z = 1,
  B = 2,
  Ye = 3,
  tn = 4,
  on = 5,
  Ln = 6,
  Io = 7,
  nn = 8,
  Ai = 9,
  Vn = 10,
  be = 11,
  Mo = 12,
  fm = 13,
  ki = 14,
  $t = 15,
  Vo = 16,
  _i = 17,
  jn = 18,
  al = 19,
  cv = 20,
  or = 21,
  ju = 22,
  Vr = 23,
  Ze = 25,
  uv = 1,
  To = 6,
  $n = 7,
  ka = 8,
  Ni = 9,
  yt = 10,
  nf = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(nf || {});
function kn(t) {
  return Array.isArray(t) && typeof t[uv] == "object";
}
function bn(t) {
  return Array.isArray(t) && t[uv] === !0;
}
function rf(t) {
  return (t.flags & 4) !== 0;
}
function jo(t) {
  return t.componentOffset > -1;
}
function ll(t) {
  return (t.flags & 1) === 1;
}
function ar(t) {
  return !!t.template;
}
function dv(t) {
  return (t[B] & 512) !== 0;
}
var fv = "svg",
  I_ = "math",
  M_ = !1;
function T_() {
  return M_;
}
function rn(t) {
  for (; Array.isArray(t); ) t = t[Ot];
  return t;
}
function hv(t, e) {
  return rn(e[t]);
}
function Pt(t, e) {
  return rn(e[t.index]);
}
function pv(t, e) {
  return t.data[e];
}
function of(t, e) {
  return t[e];
}
function ur(t, e) {
  let r = e[t];
  return kn(r) ? r : r[Ot];
}
function x_(t) {
  return (t[B] & 4) === 4;
}
function sf(t) {
  return (t[B] & 128) === 128;
}
function A_(t) {
  return bn(t[Ye]);
}
function Oi(t, e) {
  return e == null ? null : t[e];
}
function gv(t) {
  t[_i] = 0;
}
function N_(t) {
  t[B] & 1024 || ((t[B] |= 1024), sf(t) && xo(t));
}
function O_(t, e) {
  for (; t > 0; ) (e = e[ki]), t--;
  return e;
}
function af(t) {
  return !!(t[B] & 9216 || t[Vr]?.dirty);
}
function id(t) {
  af(t)
    ? xo(t)
    : t[B] & 64 &&
      (T_()
        ? ((t[B] |= 1024), xo(t))
        : t[Vn].changeDetectionScheduler?.notify());
}
function xo(t) {
  t[Vn].changeDetectionScheduler?.notify();
  let e = Ao(t);
  for (; e !== null && !(e[B] & 8192 || ((e[B] |= 8192), !sf(e))); ) e = Ao(e);
}
function mv(t, e) {
  if ((t[B] & 256) === 256) throw new b(911, !1);
  t[or] === null && (t[or] = []), t[or].push(e);
}
function P_(t, e) {
  if (t[or] === null) return;
  let r = t[or].indexOf(e);
  r !== -1 && t[or].splice(r, 1);
}
function Ao(t) {
  let e = t[Ye];
  return bn(e) ? e[Ye] : e;
}
var H = { lFrame: Ev(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function R_() {
  return H.lFrame.elementDepthCount;
}
function F_() {
  H.lFrame.elementDepthCount++;
}
function k_() {
  H.lFrame.elementDepthCount--;
}
function vv() {
  return H.bindingsEnabled;
}
function $o() {
  return H.skipHydrationRootTNode !== null;
}
function L_(t) {
  return H.skipHydrationRootTNode === t;
}
function V_(t) {
  H.skipHydrationRootTNode = t;
}
function j_() {
  H.skipHydrationRootTNode = null;
}
function Q() {
  return H.lFrame.lView;
}
function Ue() {
  return H.lFrame.tView;
}
function xe(t) {
  return (H.lFrame.contextLView = t), t[nn];
}
function Ae(t) {
  return (H.lFrame.contextLView = null), t;
}
function ot() {
  let t = yv();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function yv() {
  return H.lFrame.currentTNode;
}
function $_() {
  let t = H.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Qr(t, e) {
  let r = H.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function lf() {
  return H.lFrame.isParent;
}
function Dv() {
  H.lFrame.isParent = !1;
}
function B_() {
  return H.lFrame.contextLView;
}
function Kr() {
  let t = H.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function U_() {
  return H.lFrame.bindingIndex;
}
function H_(t) {
  return (H.lFrame.bindingIndex = t);
}
function cl() {
  return H.lFrame.bindingIndex++;
}
function wv(t) {
  let e = H.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function z_() {
  return H.lFrame.inI18n;
}
function q_(t, e) {
  let r = H.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), od(e);
}
function G_() {
  return H.lFrame.currentDirectiveIndex;
}
function od(t) {
  H.lFrame.currentDirectiveIndex = t;
}
function W_(t) {
  let e = H.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function bv() {
  return H.lFrame.currentQueryIndex;
}
function cf(t) {
  H.lFrame.currentQueryIndex = t;
}
function Q_(t) {
  let e = t[z];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[on] : null;
}
function Cv(t, e, r) {
  if (r & Y.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & Y.Host); )
      if (((i = Q_(o)), i === null || ((o = o[ki]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (H.lFrame = _v());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function uf(t) {
  let e = _v(),
    r = t[z];
  (H.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function _v() {
  let t = H.lFrame,
    e = t === null ? null : t.child;
  return e === null ? Ev(t) : e;
}
function Ev(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Sv() {
  let t = H.lFrame;
  return (H.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Iv = Sv;
function df() {
  let t = Sv();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function K_(t) {
  return (H.lFrame.contextLView = O_(t, H.lFrame.contextLView))[nn];
}
function Yr() {
  return H.lFrame.selectedIndex;
}
function jr(t) {
  H.lFrame.selectedIndex = t;
}
function ul() {
  let t = H.lFrame;
  return pv(t.tView, t.selectedIndex);
}
function dt() {
  H.lFrame.currentNamespace = fv;
}
function Cn() {
  Y_();
}
function Y_() {
  H.lFrame.currentNamespace = null;
}
function Mv() {
  return H.lFrame.currentNamespace;
}
var Tv = !0;
function dl() {
  return Tv;
}
function dr(t) {
  Tv = t;
}
function Z_() {
  return Li(ot(), Q());
}
function Li(t, e) {
  return new He(Pt(t, e));
}
var He = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = Z_;
  let t = e;
  return t;
})();
function J_(t) {
  return t instanceof He ? t.nativeElement : t;
}
function X_(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      o = e[n];
    if ((r && ((i = r(i)), (o = r(o))), o !== i)) return !1;
  }
  return !0;
}
function eE(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function ff(t, e) {
  t.forEach((r) => (Array.isArray(r) ? ff(r, e) : e(r)));
}
function xv(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function La(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function tE(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function nE(t, e, r) {
  let n = Bo(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), tE(t, n, e, r)), n;
}
function $u(t, e) {
  let r = Bo(t, e);
  if (r >= 0) return t[r | 1];
}
function Bo(t, e) {
  return rE(t, e, 1);
}
function rE(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
function iE() {
  return this._results[Symbol.iterator]();
}
var sd = class t {
    get changes() {
      return (this._changes ??= new ae());
    }
    constructor(e = !1) {
      (this._emitDistinctChangesOnly = e),
        (this.dirty = !0),
        (this._onDirty = void 0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = void 0),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let r = t.prototype;
      r[Symbol.iterator] || (r[Symbol.iterator] = iE);
    }
    get(e) {
      return this._results[e];
    }
    map(e) {
      return this._results.map(e);
    }
    filter(e) {
      return this._results.filter(e);
    }
    find(e) {
      return this._results.find(e);
    }
    reduce(e, r) {
      return this._results.reduce(e, r);
    }
    forEach(e) {
      this._results.forEach(e);
    }
    some(e) {
      return this._results.some(e);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(e, r) {
      this.dirty = !1;
      let n = eE(e);
      (this._changesDetected = !X_(this._results, n, r)) &&
        ((this._results = n),
        (this.length = n.length),
        (this.last = n[this.length - 1]),
        (this.first = n[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.emit(this);
    }
    onDirty(e) {
      this._onDirty = e;
    }
    setDirty() {
      (this.dirty = !0), this._onDirty?.();
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
  },
  oE = "ngSkipHydration",
  sE = "ngskiphydration";
function Av(t) {
  let e = t.mergedAttrs;
  if (e === null) return !1;
  for (let r = 0; r < e.length; r += 2) {
    let n = e[r];
    if (typeof n == "number") return !1;
    if (typeof n == "string" && n.toLowerCase() === sE) return !0;
  }
  return !1;
}
function Nv(t) {
  return t.hasAttribute(oE);
}
function Va(t) {
  return (t.flags & 128) === 128;
}
function aE(t) {
  if (Va(t)) return !0;
  let e = t.parent;
  for (; e; ) {
    if (Va(t) || Av(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var ad;
function Ov(t) {
  ad = t;
}
function Uo() {
  if (ad !== void 0) return ad;
  if (typeof document < "u") return document;
  throw new b(210, !1);
}
function _(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function ke(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function fl(t) {
  return hm(t, Rv) || hm(t, Fv);
}
function Pv(t) {
  return fl(t) !== null;
}
function hm(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function lE(t) {
  let e = t && (t[Rv] || t[Fv]);
  return e || null;
}
function pm(t) {
  return t && (t.hasOwnProperty(gm) || t.hasOwnProperty(cE)) ? t[gm] : null;
}
var Rv = de({ ɵprov: de }),
  gm = de({ ɵinj: de }),
  Fv = de({ ngInjectableDef: de }),
  cE = de({ ngInjectorDef: de }),
  A = class {
    constructor(e, r) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = _({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  },
  Ho = new A("", { providedIn: "root", factory: () => uE }),
  uE = "ng",
  hf = new A(""),
  ft = new A("", { providedIn: "platform", factory: () => "unknown" });
var pf = new A(""),
  gf = new A("", {
    providedIn: "root",
    factory: () =>
      Uo().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
var dE = de({ __forward_ref__: de });
function sn(t) {
  return (
    (t.__forward_ref__ = sn),
    (t.toString = function () {
      return ct(this());
    }),
    t
  );
}
function lt(t) {
  return kv(t) ? t() : t;
}
function kv(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(dE) && t.__forward_ref__ === sn
  );
}
function Lv(t) {
  return t && !!t.ɵproviders;
}
function $r(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function fE(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : $r(t);
}
function hE(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new b(-200, t);
}
function mf(t, e) {
  throw new b(-201, !1);
}
var ld;
function Vv() {
  return ld;
}
function vt(t) {
  let e = ld;
  return (ld = t), e;
}
function jv(t, e, r) {
  let n = fl(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & Y.Optional) return null;
  if (e !== void 0) return e;
  mf(t, "Injector");
}
var pE = {},
  No = pE,
  cd = "__NG_DI_FLAG__",
  ja = "ngTempTokenPath",
  gE = "ngTokenPath",
  mE = /\n/gm,
  vE = "\u0275",
  mm = "__source",
  Mi;
function yE() {
  return Mi;
}
function ir(t) {
  let e = Mi;
  return (Mi = t), e;
}
function DE(t, e = Y.Default) {
  if (Mi === void 0) throw new b(-203, !1);
  return Mi === null
    ? jv(t, void 0, e)
    : Mi.get(t, e & Y.Optional ? null : void 0, e);
}
function w(t, e = Y.Default) {
  return (Vv() || DE)(lt(t), e);
}
function C(t, e = Y.Default) {
  return w(t, hl(e));
}
function hl(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function ud(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = lt(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new b(900, !1);
      let i,
        o = Y.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          l = wE(a);
        typeof l == "number" ? (l === -1 ? (i = a.token) : (o |= l)) : (i = a);
      }
      e.push(w(i, o));
    } else e.push(w(n));
  }
  return e;
}
function $v(t, e) {
  return (t[cd] = e), (t.prototype[cd] = e), t;
}
function wE(t) {
  return t[cd];
}
function bE(t, e, r, n) {
  let i = t[ja];
  throw (
    (e[mm] && i.unshift(e[mm]),
    (t.message = CE(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[gE] = i),
    (t[ja] = null),
    t)
  );
}
function CE(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == vE
      ? t.slice(2)
      : t;
  let i = ct(e);
  if (Array.isArray(e)) i = e.map(ct).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ct(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    mE,
    `
  `
  )}`;
}
function _E() {
  let t = new Zr();
  return C(ft) === "browser" && (t.store = EE(Uo(), C(Ho))), t;
}
var Zr = (() => {
  let e = class e {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    get(n, i) {
      return this.store[n] !== void 0 ? this.store[n] : i;
    }
    set(n, i) {
      this.store[n] = i;
    }
    remove(n) {
      delete this.store[n];
    }
    hasKey(n) {
      return this.store.hasOwnProperty(n);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(n, i) {
      this.onSerializeCallbacks[n] = i;
    }
    toJson() {
      for (let n in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(n))
          try {
            this.store[n] = this.onSerializeCallbacks[n]();
          } catch (i) {
            console.warn("Exception in onSerialize callback: ", i);
          }
      return JSON.stringify(this.store).replace(/</g, "\\u003C");
    }
  };
  e.ɵprov = _({ token: e, providedIn: "root", factory: _E });
  let t = e;
  return t;
})();
function EE(t, e) {
  let r = t.getElementById(e + "-state");
  if (r?.textContent)
    try {
      return JSON.parse(r.textContent);
    } catch (n) {
      console.warn("Exception while restoring TransferState for app " + e, n);
    }
  return {};
}
var Bv = "h",
  Uv = "b",
  dd = (function (t) {
    return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
  })(dd || {}),
  SE = "e",
  IE = "t",
  vf = "c",
  Hv = "x",
  $a = "r",
  ME = "i",
  TE = "n",
  xE = "d",
  AE = "__nghData__",
  zv = AE,
  Bu = "ngh",
  NE = "nghm",
  qv = () => null;
function OE(t, e, r = !1) {
  let n = t.getAttribute(Bu);
  if (n == null) return null;
  let [i, o] = n.split("|");
  if (((n = r ? o : i), !n)) return null;
  let s = o ? `|${o}` : "",
    a = r ? i : s,
    l = {};
  if (n !== "") {
    let u = e.get(Zr, null, { optional: !0 });
    u !== null && (l = u.get(zv, [])[Number(n)]);
  }
  let c = { data: l, firstChild: t.firstChild ?? null };
  return (
    r && ((c.firstChild = t), pl(c, 0, t.nextSibling)),
    a ? t.setAttribute(Bu, a) : t.removeAttribute(Bu),
    c
  );
}
function PE() {
  qv = OE;
}
function yf(t, e, r = !1) {
  return qv(t, e, r);
}
function RE(t) {
  let e = t._lView;
  return e[z].type === 2 ? null : (dv(e) && (e = e[Ze]), e);
}
function FE(t) {
  return t.textContent?.replace(/\s/gm, "");
}
function kE(t) {
  let e = Uo(),
    r = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
      acceptNode(o) {
        let s = FE(o);
        return s === "ngetn" || s === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    n,
    i = [];
  for (; (n = r.nextNode()); ) i.push(n);
  for (let o of i)
    o.textContent === "ngetn"
      ? o.replaceWith(e.createTextNode(""))
      : o.remove();
}
function pl(t, e, r) {
  (t.segmentHeads ??= {}), (t.segmentHeads[e] = r);
}
function fd(t, e) {
  return t.segmentHeads?.[e] ?? null;
}
function LE(t, e) {
  let r = t.data,
    n = r[SE]?.[e] ?? null;
  return n === null && r[vf]?.[e] && (n = Df(t, e)), n;
}
function Gv(t, e) {
  return t.data[vf]?.[e] ?? null;
}
function Df(t, e) {
  let r = Gv(t, e) ?? [],
    n = 0;
  for (let i of r) n += i[$a] * (i[Hv] ?? 1);
  return n;
}
function gl(t, e) {
  if (typeof t.disconnectedNodes > "u") {
    let r = t.data[xE];
    t.disconnectedNodes = r ? new Set(r) : null;
  }
  return !!t.disconnectedNodes?.has(e);
}
var wa = "__parameters__";
function VE(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Wv(t, e, r) {
  return ko(() => {
    let n = VE(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(l, c, u) {
        let d = l.hasOwnProperty(wa)
          ? l[wa]
          : Object.defineProperty(l, wa, { value: [] })[wa];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), l;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var zo = $v(Wv("Optional"), 8);
var ml = $v(Wv("SkipSelf"), 4);
function Br(t, e) {
  let r = t.hasOwnProperty(Fa);
  return r ? t[Fa] : null;
}
var Ur = new A(""),
  Qv = new A("", -1),
  Kv = new A(""),
  Ba = class {
    get(e, r = No) {
      if (r === No) {
        let n = new Error(`NullInjectorError: No provider for ${ct(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  };
function Vi(t) {
  return { ɵproviders: t };
}
function jE(...t) {
  return { ɵproviders: Yv(!0, t), ɵfromNgModule: !0 };
}
function Yv(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    ff(e, (s) => {
      let a = s;
      hd(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Zv(i, o),
    r
  );
}
function Zv(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    wf(i, (o) => {
      e(o, n);
    });
  }
}
function hd(t, e, r, n) {
  if (((t = lt(t)), !t)) return !1;
  let i = null,
    o = pm(t),
    s = !o && sr(t);
  if (!o && !s) {
    let l = t.ngModule;
    if (((o = pm(l)), o)) i = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let l =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of l) hd(c, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let c;
      try {
        ff(o.imports, (u) => {
          hd(u, e, r, n) && ((c ||= []), c.push(u));
        });
      } finally {
      }
      c !== void 0 && Zv(c, e);
    }
    if (!a) {
      let c = Br(i) || (() => new i());
      e({ provide: i, useFactory: c, deps: Nt }, i),
        e({ provide: Kv, useValue: i, multi: !0 }, i),
        e({ provide: Ur, useValue: () => w(i), multi: !0 }, i);
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = t;
      wf(l, (u) => {
        e(u, c);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function wf(t, e) {
  for (let r of t)
    Lv(r) && (r = r.ɵproviders), Array.isArray(r) ? wf(r, e) : e(r);
}
var $E = de({ provide: String, useValue: de });
function Jv(t) {
  return t !== null && typeof t == "object" && $E in t;
}
function BE(t) {
  return !!(t && t.useExisting);
}
function UE(t) {
  return !!(t && t.useFactory);
}
function Pi(t) {
  return typeof t == "function";
}
function HE(t) {
  return !!t.useClass;
}
var vl = new A(""),
  xa = {},
  zE = {},
  Uu;
function bf() {
  return Uu === void 0 && (Uu = new Ba()), Uu;
}
var ut = class {},
  Oo = class extends ut {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        gd(e, (s) => this.processProvider(s)),
        this.records.set(Qv, Ei(void 0, this)),
        i.has("environment") && this.records.set(ut, Ei(void 0, this));
      let o = this.records.get(vl);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Kv, Nt, Y.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = ir(this),
        n = vt(void 0),
        i;
      try {
        return e();
      } finally {
        ir(r), vt(n);
      }
    }
    get(e, r = No, n = Y.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(am))) return e[am](this);
      n = hl(n);
      let i,
        o = ir(this),
        s = vt(void 0);
      try {
        if (!(n & Y.SkipSelf)) {
          let l = this.records.get(e);
          if (l === void 0) {
            let c = KE(e) && fl(e);
            c && this.injectableDefInScope(c)
              ? (l = Ei(pd(e), xa))
              : (l = null),
              this.records.set(e, l);
          }
          if (l != null) return this.hydrate(e, l);
        }
        let a = n & Y.Self ? bf() : this.parent;
        return (r = n & Y.Optional && r === No ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[ja] = a[ja] || []).unshift(ct(e)), o)) throw a;
          return bE(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        vt(s), ir(o);
      }
    }
    resolveInjectorInitializers() {
      let e = ir(this),
        r = vt(void 0),
        n;
      try {
        let i = this.get(Ur, Nt, Y.Self);
        for (let o of i) o();
      } finally {
        ir(e), vt(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(ct(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new b(205, !1);
    }
    processProvider(e) {
      e = lt(e);
      let r = Pi(e) ? e : lt(e && e.provide),
        n = GE(e);
      if (!Pi(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = Ei(void 0, xa, !0)),
          (i.factory = () => ud(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === xa && ((r.value = zE), (r.value = r.factory())),
        typeof r.value == "object" &&
          r.value &&
          QE(r.value) &&
          this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = lt(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function pd(t) {
  let e = fl(t),
    r = e !== null ? e.factory : Br(t);
  if (r !== null) return r;
  if (t instanceof A) throw new b(204, !1);
  if (t instanceof Function) return qE(t);
  throw new b(204, !1);
}
function qE(t) {
  if (t.length > 0) throw new b(204, !1);
  let r = lE(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function GE(t) {
  if (Jv(t)) return Ei(void 0, t.useValue);
  {
    let e = Xv(t);
    return Ei(e, xa);
  }
}
function Xv(t, e, r) {
  let n;
  if (Pi(t)) {
    let i = lt(t);
    return Br(i) || pd(i);
  } else if (Jv(t)) n = () => lt(t.useValue);
  else if (UE(t)) n = () => t.useFactory(...ud(t.deps || []));
  else if (BE(t)) n = () => w(lt(t.useExisting));
  else {
    let i = lt(t && (t.useClass || t.provide));
    if (WE(t)) n = () => new i(...ud(t.deps));
    else return Br(i) || pd(i);
  }
  return n;
}
function Ei(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function WE(t) {
  return !!t.deps;
}
function QE(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function KE(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof A);
}
function gd(t, e) {
  for (let r of t)
    Array.isArray(r) ? gd(r, e) : r && Lv(r) ? gd(r.ɵproviders, e) : e(r);
}
function _n(t, e) {
  t instanceof Oo && t.assertNotDestroyed();
  let r,
    n = ir(t),
    i = vt(void 0);
  try {
    return e();
  } finally {
    ir(n), vt(i);
  }
}
function YE(t) {
  if (!Vv() && !yE()) throw new b(-203, !1);
}
function ZE(t) {
  let e = Pe.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function JE(t) {
  return typeof t == "function";
}
var md = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ey(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function Dt() {
  return ty;
}
function ty(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = eS), XE;
}
Dt.ngInherit = !0;
function XE() {
  let t = ry(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === xi) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function eS(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = ry(t) || tS(t, { previous: xi, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  (a[o] = new md(c && c.currentValue, r, l === xi)), ey(t, e, i, r);
}
var ny = "__ngSimpleChanges__";
function ry(t) {
  return t[ny] || null;
}
function tS(t, e) {
  return (t[ny] = e);
}
var vm = null;
var vn = function (t, e, r) {
  vm?.(t, e, r);
};
function nS(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = ty(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function yl(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: u,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      l && (t.viewHooks ??= []).push(-r, l),
      c &&
        ((t.viewHooks ??= []).push(r, c), (t.viewCheckHooks ??= []).push(r, c)),
      u != null && (t.destroyHooks ??= []).push(r, u);
  }
}
function Aa(t, e, r) {
  iy(t, e, 3, r);
}
function Na(t, e, r, n) {
  (t[B] & 3) === r && iy(t, e, r, n);
}
function Hu(t, e) {
  let r = t[B];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[B] = r));
}
function iy(t, e, r, n) {
  let i = n !== void 0 ? t[_i] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let l = i; l < s; l++)
    if (typeof e[l + 1] == "number") {
      if (((a = e[l]), n != null && a >= n)) break;
    } else
      e[l] < 0 && (t[_i] += 65536),
        (a < o || o == -1) &&
          (rS(t, r, e, l), (t[_i] = (t[_i] & 4294901760) + l + 2)),
        l++;
}
function ym(t, e) {
  vn(4, t, e);
  let r = xt(null);
  try {
    e.call(t);
  } finally {
    xt(r), vn(5, t, e);
  }
}
function rS(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[B] >> 14 < t[_i] >> 16 &&
      (t[B] & 3) === e &&
      ((t[B] += 16384), ym(a, o))
    : ym(a, o);
}
var Ti = -1,
  Hr = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function iS(t) {
  return t instanceof Hr;
}
function oS(t) {
  return (t.flags & 8) !== 0;
}
function sS(t) {
  return (t.flags & 16) !== 0;
}
function oy(t) {
  return t !== Ti;
}
function Ua(t) {
  return t & 32767;
}
function aS(t) {
  return t >> 16;
}
function Ha(t, e) {
  let r = aS(t),
    n = e;
  for (; r > 0; ) (n = n[ki]), r--;
  return n;
}
var vd = !0;
function za(t) {
  let e = vd;
  return (vd = t), e;
}
var lS = 256,
  sy = lS - 1,
  ay = 5,
  cS = 0,
  yn = {};
function uS(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(_o) && (n = r[_o]),
    n == null && (n = r[_o] = cS++);
  let i = n & sy,
    o = 1 << i;
  e.data[t + (i >> ay)] |= o;
}
function qa(t, e) {
  let r = ly(t, e);
  if (r !== -1) return r;
  let n = e[z];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    zu(n.data, t),
    zu(e, null),
    zu(n.blueprint, null));
  let i = Cf(t, e),
    o = t.injectorIndex;
  if (oy(i)) {
    let s = Ua(i),
      a = Ha(i, e),
      l = a[z].data;
    for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | l[s + c];
  }
  return (e[o + 8] = i), o;
}
function zu(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function ly(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Cf(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = hy(i)), n === null)) return Ti;
    if ((r++, (i = i[ki]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return Ti;
}
function yd(t, e, r) {
  uS(t, e, r);
}
function dS(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let r = t.attrs;
  if (r) {
    let n = r.length,
      i = 0;
    for (; i < n; ) {
      let o = r[i];
      if (ev(o)) break;
      if (o === 0) i = i + 2;
      else if (typeof o == "number")
        for (i++; i < n && typeof r[i] == "string"; ) i++;
      else {
        if (o === e) return r[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function cy(t, e, r) {
  if (r & Y.Optional || t !== void 0) return t;
  mf(e, "NodeInjector");
}
function uy(t, e, r, n) {
  if (
    (r & Y.Optional && n === void 0 && (n = null), !(r & (Y.Self | Y.Host)))
  ) {
    let i = t[Ai],
      o = vt(void 0);
    try {
      return i ? i.get(e, n, r & Y.Optional) : jv(e, n, r & Y.Optional);
    } finally {
      vt(o);
    }
  }
  return cy(n, e, r);
}
function dy(t, e, r, n = Y.Default, i) {
  if (t !== null) {
    if (e[B] & 2048 && !(n & Y.Self)) {
      let s = gS(t, e, r, n, yn);
      if (s !== yn) return s;
    }
    let o = fy(t, e, r, n, yn);
    if (o !== yn) return o;
  }
  return uy(e, r, n, i);
}
function fy(t, e, r, n, i) {
  let o = hS(r);
  if (typeof o == "function") {
    if (!Cv(e, t, n)) return n & Y.Host ? cy(i, r, n) : uy(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & Y.Optional))) mf(r);
      else return s;
    } finally {
      Iv();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = ly(t, e),
      l = Ti,
      c = n & Y.Host ? e[$t][on] : null;
    for (
      (a === -1 || n & Y.SkipSelf) &&
      ((l = a === -1 ? Cf(t, e) : e[a + 8]),
      l === Ti || !wm(n, !1)
        ? (a = -1)
        : ((s = e[z]), (a = Ua(l)), (e = Ha(l, e))));
      a !== -1;

    ) {
      let u = e[z];
      if (Dm(o, a, u.data)) {
        let d = fS(a, e, r, s, n, c);
        if (d !== yn) return d;
      }
      (l = e[a + 8]),
        l !== Ti && wm(n, e[z].data[a + 8] === c) && Dm(o, a, e)
          ? ((s = u), (a = Ua(l)), (e = Ha(l, e)))
          : (a = -1);
    }
  }
  return i;
}
function fS(t, e, r, n, i, o) {
  let s = e[z],
    a = s.data[t + 8],
    l = n == null ? jo(a) && vd : n != s && (a.type & 3) !== 0,
    c = i & Y.Host && o === a,
    u = Oa(a, s, r, l, c);
  return u !== null ? zr(e, s, u, a) : yn;
}
function Oa(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    l = t.directiveStart,
    c = t.directiveEnd,
    u = o >> 20,
    d = n ? a : a + u,
    p = i ? a + u : c;
  for (let g = d; g < p; g++) {
    let v = s[g];
    if ((g < l && r === v) || (g >= l && v.type === r)) return g;
  }
  if (i) {
    let g = s[l];
    if (g && ar(g) && g.type === r) return l;
  }
  return null;
}
function zr(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (iS(i)) {
    let s = i;
    s.resolving && hE(fE(o[r]));
    let a = za(s.canSeeViewProviders);
    s.resolving = !0;
    let l,
      c = s.injectImpl ? vt(s.injectImpl) : null,
      u = Cv(t, n, Y.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && nS(r, o[r], e);
    } finally {
      c !== null && vt(c), za(a), (s.resolving = !1), Iv();
    }
  }
  return i;
}
function hS(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(_o) ? t[_o] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & sy : pS) : e;
}
function Dm(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> ay)] & n);
}
function wm(t, e) {
  return !(t & Y.Self) && !(t & Y.Host && e);
}
var Lr = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return dy(this._tNode, this._lView, e, hl(n), r);
  }
};
function pS() {
  return new Lr(ot(), Q());
}
function fr(t) {
  return ko(() => {
    let e = t.prototype.constructor,
      r = e[Fa] || Dd(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Fa] || Dd(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Dd(t) {
  return kv(t)
    ? () => {
        let e = Dd(lt(t));
        return e && e();
      }
    : Br(t);
}
function gS(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[B] & 2048 && !(s[B] & 512); ) {
    let a = fy(o, s, r, n | Y.Self, yn);
    if (a !== yn) return a;
    let l = o.parent;
    if (!l) {
      let c = s[cv];
      if (c) {
        let u = c.get(r, yn, n);
        if (u !== yn) return u;
      }
      (l = hy(s)), (s = s[ki]);
    }
    o = l;
  }
  return i;
}
function hy(t) {
  let e = t[z],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[on] : null;
}
function Dl(t) {
  return dS(ot(), t);
}
function bm(t, e = null, r = null, n) {
  let i = py(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function py(t, e = null, r = null, n, i = new Set()) {
  let o = [r || Nt, jE(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : ct(t))),
    new Oo(o, e || bf(), n || null, i)
  );
}
var Ut = (() => {
    let e = class e {
      static create(n, i) {
        if (Array.isArray(n)) return bm({ name: "" }, i, n, "");
        {
          let o = n.name ?? "";
          return bm({ name: o }, n.parent, n.providers, o);
        }
      }
    };
    (e.THROW_IF_NOT_FOUND = No),
      (e.NULL = new Ba()),
      (e.ɵprov = _({ token: e, providedIn: "any", factory: () => w(Qv) })),
      (e.__NG_ELEMENT_ID__ = -1);
    let t = e;
    return t;
  })(),
  mS = "ngOriginalError";
function qu(t) {
  return t[mS];
}
var Bt = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && qu(e);
      for (; r && qu(r); ) r = qu(r);
      return r || null;
    }
  },
  gy = new A("", {
    providedIn: "root",
    factory: () => C(Bt).handleError.bind(void 0),
  }),
  ba = new A(""),
  my = !1,
  vy = new A("", { providedIn: "root", factory: () => my }),
  Ca;
function vS() {
  if (Ca === void 0 && ((Ca = null), Pe.trustedTypes))
    try {
      Ca = Pe.trustedTypes.createPolicy("angular", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return Ca;
}
function wl(t) {
  return vS()?.createHTML(t) || t;
}
var _a;
function yy() {
  if (_a === void 0 && ((_a = null), Pe.trustedTypes))
    try {
      _a = Pe.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return _a;
}
function Cm(t) {
  return yy()?.createHTML(t) || t;
}
function _m(t) {
  return yy()?.createScriptURL(t) || t;
}
var Ga = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Zm})`;
  }
};
function ji(t) {
  return t instanceof Ga ? t.changingThisBreaksApplicationSecurity : t;
}
function bl(t, e) {
  let r = yS(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${Zm})`);
  }
  return r === e;
}
function yS(t) {
  return (t instanceof Ga && t.getTypeName()) || null;
}
function DS(t) {
  let e = new bd(t);
  return wS() ? new wd(e) : e;
}
var wd = class {
    constructor(e) {
      this.inertDocumentHelper = e;
    }
    getInertBodyElement(e) {
      e = "<body><remove></remove>" + e;
      try {
        let r = new window.DOMParser().parseFromString(wl(e), "text/html").body;
        return r === null
          ? this.inertDocumentHelper.getInertBodyElement(e)
          : (r.removeChild(r.firstChild), r);
      } catch {
        return null;
      }
    }
  },
  bd = class {
    constructor(e) {
      (this.defaultDoc = e),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            "sanitization-inert"
          ));
    }
    getInertBodyElement(e) {
      let r = this.inertDocument.createElement("template");
      return (r.innerHTML = wl(e)), r;
    }
  };
function wS() {
  try {
    return !!new window.DOMParser().parseFromString(wl(""), "text/html");
  } catch {
    return !1;
  }
}
var bS = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function _f(t) {
  return (t = String(t)), t.match(bS) ? t : "unsafe:" + t;
}
function Hn(t) {
  let e = {};
  for (let r of t.split(",")) e[r] = !0;
  return e;
}
function qo(...t) {
  let e = {};
  for (let r of t) for (let n in r) r.hasOwnProperty(n) && (e[n] = !0);
  return e;
}
var Dy = Hn("area,br,col,hr,img,wbr"),
  wy = Hn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
  by = Hn("rp,rt"),
  CS = qo(by, wy),
  _S = qo(
    wy,
    Hn(
      "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
    )
  ),
  ES = qo(
    by,
    Hn(
      "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
    )
  ),
  Em = qo(Dy, _S, ES, CS),
  Cy = Hn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
  SS = Hn(
    "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
  ),
  IS = Hn(
    "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
  ),
  MS = qo(Cy, SS, IS),
  TS = Hn("script,style,template"),
  Cd = class {
    constructor() {
      (this.sanitizedSomething = !1), (this.buf = []);
    }
    sanitizeChildren(e) {
      let r = e.firstChild,
        n = !0;
      for (; r; ) {
        if (
          (r.nodeType === Node.ELEMENT_NODE
            ? (n = this.startElement(r))
            : r.nodeType === Node.TEXT_NODE
            ? this.chars(r.nodeValue)
            : (this.sanitizedSomething = !0),
          n && r.firstChild)
        ) {
          r = r.firstChild;
          continue;
        }
        for (; r; ) {
          r.nodeType === Node.ELEMENT_NODE && this.endElement(r);
          let i = this.checkClobberedElement(r, r.nextSibling);
          if (i) {
            r = i;
            break;
          }
          r = this.checkClobberedElement(r, r.parentNode);
        }
      }
      return this.buf.join("");
    }
    startElement(e) {
      let r = e.nodeName.toLowerCase();
      if (!Em.hasOwnProperty(r))
        return (this.sanitizedSomething = !0), !TS.hasOwnProperty(r);
      this.buf.push("<"), this.buf.push(r);
      let n = e.attributes;
      for (let i = 0; i < n.length; i++) {
        let o = n.item(i),
          s = o.name,
          a = s.toLowerCase();
        if (!MS.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let l = o.value;
        Cy[a] && (l = _f(l)), this.buf.push(" ", s, '="', Sm(l), '"');
      }
      return this.buf.push(">"), !0;
    }
    endElement(e) {
      let r = e.nodeName.toLowerCase();
      Em.hasOwnProperty(r) &&
        !Dy.hasOwnProperty(r) &&
        (this.buf.push("</"), this.buf.push(r), this.buf.push(">"));
    }
    chars(e) {
      this.buf.push(Sm(e));
    }
    checkClobberedElement(e, r) {
      if (
        r &&
        (e.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_CONTAINED_BY) ===
          Node.DOCUMENT_POSITION_CONTAINED_BY
      )
        throw new Error(
          `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
        );
      return r;
    }
  },
  xS = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  AS = /([^\#-~ |!])/g;
function Sm(t) {
  return t
    .replace(/&/g, "&amp;")
    .replace(xS, function (e) {
      let r = e.charCodeAt(0),
        n = e.charCodeAt(1);
      return "&#" + ((r - 55296) * 1024 + (n - 56320) + 65536) + ";";
    })
    .replace(AS, function (e) {
      return "&#" + e.charCodeAt(0) + ";";
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
var Ea;
function _y(t, e) {
  let r = null;
  try {
    Ea = Ea || DS(t);
    let n = e ? String(e) : "";
    r = Ea.getInertBodyElement(n);
    let i = 5,
      o = n;
    do {
      if (i === 0)
        throw new Error(
          "Failed to sanitize html because the input is unstable"
        );
      i--, (n = o), (o = r.innerHTML), (r = Ea.getInertBodyElement(n));
    } while (n !== o);
    let a = new Cd().sanitizeChildren(Im(r) || r);
    return wl(a);
  } finally {
    if (r) {
      let n = Im(r) || r;
      for (; n.firstChild; ) n.removeChild(n.firstChild);
    }
  }
}
function Im(t) {
  return "content" in t && NS(t) ? t.content : null;
}
function NS(t) {
  return t.nodeType === Node.ELEMENT_NODE && t.nodeName === "TEMPLATE";
}
var Go = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Go || {});
function Cl(t) {
  let e = Ef();
  return e
    ? Cm(e.sanitize(Go.HTML, t) || "")
    : bl(t, "HTML")
    ? Cm(ji(t))
    : _y(Uo(), $r(t));
}
function wt(t) {
  let e = Ef();
  return e ? e.sanitize(Go.URL, t) || "" : bl(t, "URL") ? ji(t) : _f($r(t));
}
function OS(t) {
  let e = Ef();
  if (e) return _m(e.sanitize(Go.RESOURCE_URL, t) || "");
  if (bl(t, "ResourceURL")) return _m(ji(t));
  throw new b(904, !1);
}
function PS(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? OS
    : wt;
}
function Ey(t, e, r) {
  return PS(e, r)(t);
}
function Ef() {
  let t = Q();
  return t && t[Vn].sanitizer;
}
var RS = /^>|^->|<!--|-->|--!>|<!-$/g,
  FS = /(<|>)/g,
  kS = "\u200B$1\u200B";
function LS(t) {
  return t.replace(RS, (e) => e.replace(FS, kS));
}
var Sy = new Map(),
  VS = 0;
function jS() {
  return VS++;
}
function $S(t) {
  Sy.set(t[al], t);
}
function BS(t) {
  Sy.delete(t[al]);
}
var Mm = "__ngContext__";
function lr(t, e) {
  kn(e) ? ((t[Mm] = e[al]), $S(e)) : (t[Mm] = e);
}
function Iy(t) {
  return t.ownerDocument.defaultView;
}
function My(t) {
  return t.ownerDocument;
}
function US(t) {
  return t.ownerDocument.body;
}
function Ty(t) {
  return t instanceof Function ? t() : t;
}
function Co(t) {
  return (t ?? C(Ut)).get(ft) === "browser";
}
var wn = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(wn || {}),
  HS;
function Sf(t, e) {
  return HS(t, e);
}
function Si(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    bn(n) ? (o = n) : kn(n) && ((s = !0), (n = n[Ot]));
    let a = rn(n);
    t === 0 && r !== null
      ? i == null
        ? Ry(e, r, a)
        : Wa(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? Wa(e, r, a, i || null, !0)
      : t === 2
      ? ky(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && s1(e, t, o, r, i);
  }
}
function xy(t, e) {
  return t.createText(e);
}
function zS(t, e, r) {
  t.setValue(e, r);
}
function Ay(t, e) {
  return t.createComment(LS(e));
}
function If(t, e, r) {
  return t.createElement(e, r);
}
function qS(t, e) {
  Ny(t, e), (e[Ot] = null), (e[on] = null);
}
function GS(t, e, r, n, i, o) {
  (n[Ot] = i), (n[on] = e), El(t, n, r, 1, i, o);
}
function Ny(t, e) {
  El(t, e, e[be], 2, null, null);
}
function WS(t) {
  let e = t[Mo];
  if (!e) return Gu(t[z], t);
  for (; e; ) {
    let r = null;
    if (kn(e)) r = e[Mo];
    else {
      let n = e[yt];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[tn] && e !== t; ) kn(e) && Gu(e[z], e), (e = e[Ye]);
      e === null && (e = t), kn(e) && Gu(e[z], e), (r = e && e[tn]);
    }
    e = r;
  }
}
function QS(t, e, r, n) {
  let i = yt + n,
    o = r.length;
  n > 0 && (r[i - 1][tn] = e),
    n < o - yt
      ? ((e[tn] = r[i]), xv(r, yt + n, e))
      : (r.push(e), (e[tn] = null)),
    (e[Ye] = r);
  let s = e[Vo];
  s !== null && r !== s && KS(s, e);
  let a = e[jn];
  a !== null && a.insertView(t), id(e), (e[B] |= 128);
}
function KS(t, e) {
  let r = t[Ni],
    i = e[Ye][Ye][$t];
  e[$t] !== i && (t[B] |= nf.HasTransplantedViews),
    r === null ? (t[Ni] = [e]) : r.push(e);
}
function Oy(t, e) {
  let r = t[Ni],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function _d(t, e) {
  if (t.length <= yt) return;
  let r = yt + e,
    n = t[r];
  if (n) {
    let i = n[Vo];
    i !== null && i !== t && Oy(i, n), e > 0 && (t[r - 1][tn] = n[tn]);
    let o = La(t, yt + e);
    qS(n[z], n);
    let s = o[jn];
    s !== null && s.detachView(o[z]),
      (n[Ye] = null),
      (n[tn] = null),
      (n[B] &= -129);
  }
  return n;
}
function Py(t, e) {
  if (!(e[B] & 256)) {
    let r = e[be];
    r.destroyNode && El(t, e, r, 3, null, null), WS(e);
  }
}
function Gu(t, e) {
  if (!(e[B] & 256)) {
    (e[B] &= -129),
      (e[B] |= 256),
      e[Vr] && Ag(e[Vr]),
      ZS(t, e),
      YS(t, e),
      e[z].type === 1 && e[be].destroy();
    let r = e[Vo];
    if (r !== null && bn(e[Ye])) {
      r !== e[Ye] && Oy(r, e);
      let n = e[jn];
      n !== null && n.detachView(t);
    }
    BS(e);
  }
}
function YS(t, e) {
  let r = t.cleanup,
    n = e[Io];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[Io] = null);
  let i = e[or];
  if (i !== null) {
    e[or] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function ZS(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Hr)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              l = o[s + 1];
            vn(4, a, l);
            try {
              l.call(a);
            } finally {
              vn(5, a, l);
            }
          }
        else {
          vn(4, i, o);
          try {
            o.call(i);
          } finally {
            vn(5, i, o);
          }
        }
      }
    }
}
function JS(t, e, r) {
  return XS(t, e.parent, r);
}
function XS(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[Ot];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === Dn.None || o === Dn.Emulated) return null;
    }
    return Pt(n, r);
  }
}
function Wa(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function Ry(t, e, r) {
  t.appendChild(e, r);
}
function Tm(t, e, r, n, i) {
  n !== null ? Wa(t, e, r, n, i) : Ry(t, e, r);
}
function e1(t, e, r, n) {
  t.removeChild(e, r, n);
}
function Mf(t, e) {
  return t.parentNode(e);
}
function t1(t, e) {
  return t.nextSibling(e);
}
function n1(t, e, r) {
  return i1(t, e, r);
}
function r1(t, e, r) {
  return t.type & 40 ? Pt(t, r) : null;
}
var i1 = r1,
  xm;
function _l(t, e, r, n) {
  let i = JS(t, n, e),
    o = e[be],
    s = n.parent || e[on],
    a = n1(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let l = 0; l < r.length; l++) Tm(o, i, r[l], a, !1);
    else Tm(o, i, r, a, !1);
  xm !== void 0 && xm(o, n, e, r, i);
}
function Pa(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return Pt(e, t);
    if (r & 4) return Ed(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return Pa(t, n);
      {
        let i = t[e.index];
        return bn(i) ? Ed(-1, i) : rn(i);
      }
    } else {
      if (r & 32) return Sf(e, t)() || rn(t[e.index]);
      {
        let n = Fy(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = Ao(t[$t]);
          return Pa(i, n);
        } else return Pa(t, e.next);
      }
    }
  }
  return null;
}
function Fy(t, e) {
  if (e !== null) {
    let n = t[$t][on],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function Ed(t, e) {
  let r = yt + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[z].firstChild;
    if (i !== null) return Pa(n, i);
  }
  return e[$n];
}
function ky(t, e, r) {
  let n = Mf(t, e);
  n && e1(t, n, e, r);
}
function Ly(t) {
  t.textContent = "";
}
function Tf(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      l = r.type;
    if (
      (s && e === 0 && (a && lr(rn(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (l & 8) Tf(t, e, r.child, n, i, o, !1), Si(e, t, i, a, o);
      else if (l & 32) {
        let c = Sf(r, n),
          u;
        for (; (u = c()); ) Si(e, t, i, u, o);
        Si(e, t, i, a, o);
      } else l & 16 ? o1(t, e, n, r, i, o) : Si(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function El(t, e, r, n, i, o) {
  Tf(r, n, t.firstChild, e, i, o, !1);
}
function o1(t, e, r, n, i, o) {
  let s = r[$t],
    l = s[on].projection[n.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let u = l[c];
      Si(e, t, i, u, o);
    }
  else {
    let c = l,
      u = s[Ye];
    Va(n) && (c.flags |= 128), Tf(t, e, c, u, i, o, !0);
  }
}
function s1(t, e, r, n, i) {
  let o = r[$n],
    s = rn(r);
  o !== s && Si(e, t, n, o, i);
  for (let a = yt; a < r.length; a++) {
    let l = r[a];
    El(l[z], l, t, e, n, o);
  }
}
function a1(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : wn.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= wn.Important)),
        t.setStyle(r, n, i, o));
  }
}
function l1(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Vy(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function jy(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && rd(t, e, n),
    i !== null && Vy(t, e, i),
    o !== null && l1(t, e, o);
}
var an = {};
function D(t = 1) {
  $y(Ue(), Q(), Yr() + t, !1);
}
function $y(t, e, r, n) {
  if (!n)
    if ((e[B] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && Aa(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && Na(e, o, 0, r);
    }
  jr(r);
}
function y(t, e = Y.Default) {
  let r = Q();
  if (r === null) return w(t, e);
  let n = ot();
  return dy(n, r, lt(t), e);
}
function By() {
  let t = "invalid";
  throw new Error(t);
}
function Uy(t, e, r, n, i, o) {
  let s = xt(null);
  try {
    let a = null;
    i & Re.SignalBased && (a = e[n][hu]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & Re.HasDecoratorInputTransform &&
        (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : ey(e, a, n, o);
  } finally {
    xt(s);
  }
}
function c1(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) jr(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          q_(s, o);
          let l = e[o];
          a(2, l);
        }
      }
    } finally {
      jr(-1);
    }
}
function Sl(t, e, r, n, i, o, s, a, l, c, u) {
  let d = e.blueprint.slice();
  return (
    (d[Ot] = i),
    (d[B] = n | 4 | 128 | 8 | 64),
    (c !== null || (t && t[B] & 2048)) && (d[B] |= 2048),
    gv(d),
    (d[Ye] = d[ki] = t),
    (d[nn] = r),
    (d[Vn] = s || (t && t[Vn])),
    (d[be] = a || (t && t[be])),
    (d[Ai] = l || (t && t[Ai]) || null),
    (d[on] = o),
    (d[al] = jS()),
    (d[Ln] = u),
    (d[cv] = c),
    (d[$t] = e.type == 2 ? t[$t] : d),
    d
  );
}
function Wo(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = u1(t, e, r, n, i)), z_() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = $_();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Qr(o, !0), o;
}
function u1(t, e, r, n, i) {
  let o = yv(),
    s = lf(),
    a = s ? o : o && o.parent,
    l = (t.data[e] = v1(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = l),
    o !== null &&
      (s
        ? o.child == null && l.parent !== null && (o.child = l)
        : o.next === null && ((o.next = l), (l.prev = o))),
    l
  );
}
function Hy(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function zy(t, e, r, n, i) {
  let o = Yr(),
    s = n & 2;
  try {
    jr(-1), s && e.length > Ze && $y(t, e, Ze, !1), vn(s ? 2 : 0, i), r(n, i);
  } finally {
    jr(o), vn(s ? 3 : 1, i);
  }
}
function xf(t, e, r) {
  if (rf(e)) {
    let n = xt(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let l = r[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      xt(n);
    }
  }
}
function Af(t, e, r) {
  vv() && (_1(t, e, r, Pt(r, e)), (r.flags & 64) === 64 && Qy(t, e, r));
}
function Nf(t, e, r = Pt) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function qy(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Of(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Of(t, e, r, n, i, o, s, a, l, c, u) {
  let d = Ze + n,
    p = d + i,
    g = d1(d, p),
    v = typeof c == "function" ? c() : c;
  return (g[z] = {
    type: t,
    blueprint: g,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: g.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: l,
    consts: v,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function d1(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : an);
  return r;
}
function f1(t, e, r, n) {
  let o = n.get(vy, my) || r === Dn.ShadowDom,
    s = t.selectRootElement(e, o);
  return h1(s), s;
}
function h1(t) {
  Gy(t);
}
var Gy = () => null;
function p1(t) {
  Nv(t) ? Ly(t) : kE(t);
}
function g1() {
  Gy = p1;
}
function m1(t, e, r, n) {
  let i = Zy(e);
  i.push(r), t.firstCreatePass && Jy(t).push(n, i.length - 1);
}
function v1(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    $o() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Am(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      l = Re.None;
    Array.isArray(s) ? ((a = s[0]), (l = s[1])) : (a = s);
    let c = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      c = i[o];
    }
    t === 0 ? Nm(n, r, c, a, l) : Nm(n, r, c, a);
  }
  return n;
}
function Nm(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function y1(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    l = null,
    c = null;
  for (let u = n; u < i; u++) {
    let d = o[u],
      p = r ? r.get(d) : null,
      g = p ? p.inputs : null,
      v = p ? p.outputs : null;
    (l = Am(0, d.inputs, u, l, g)), (c = Am(1, d.outputs, u, c, v));
    let S = l !== null && s !== null && !nv(e) ? R1(l, u, s) : null;
    a.push(S);
  }
  l !== null &&
    (l.hasOwnProperty("class") && (e.flags |= 8),
    l.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = l),
    (e.outputs = c);
}
function D1(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function Pf(t, e, r, n, i, o, s, a) {
  let l = Pt(e, r),
    c = e.inputs,
    u;
  !a && c != null && (u = c[n])
    ? (Ff(t, r, u, n, i), jo(e) && w1(r, e.index))
    : e.type & 3
    ? ((n = D1(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(l, n, i))
    : e.type & 12;
}
function w1(t, e) {
  let r = ur(e, t);
  r[B] & 16 || (r[B] |= 64);
}
function Rf(t, e, r, n) {
  if (vv()) {
    let i = n === null ? null : { "": -1 },
      o = S1(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Wy(t, e, r, s, i, a),
      i && I1(r, n, i);
  }
  r.mergedAttrs = So(r.mergedAttrs, r.attrs);
}
function Wy(t, e, r, n, i, o) {
  for (let c = 0; c < n.length; c++) yd(qa(r, e), t, n[c].type);
  T1(r, t.data.length, n.length);
  for (let c = 0; c < n.length; c++) {
    let u = n[c];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    l = Hy(t, e, n.length, null);
  for (let c = 0; c < n.length; c++) {
    let u = n[c];
    (r.mergedAttrs = So(r.mergedAttrs, u.hostAttrs)),
      x1(t, r, e, l, u),
      M1(l, u, i),
      u.contentQueries !== null && (r.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (r.flags |= 64);
    let d = u.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      l++;
  }
  y1(t, r, o);
}
function b1(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    C1(s) != a && s.push(a), s.push(r, n, o);
  }
}
function C1(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function _1(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  jo(r) && A1(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || qa(r, e),
    lr(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let l = t.data[a],
      c = zr(e, t, a, r);
    if ((lr(c, e), s !== null && P1(e, a - i, c, l, r, s), ar(l))) {
      let u = ur(r.index, e);
      u[nn] = zr(e, t, a, r);
    }
  }
}
function Qy(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = G_();
  try {
    jr(o);
    for (let a = n; a < i; a++) {
      let l = t.data[a],
        c = e[a];
      od(a),
        (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) &&
          E1(l, c);
    }
  } finally {
    jr(-1), od(s);
  }
}
function E1(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function S1(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (v_(e, s.selectors, !1))
        if ((n || (n = []), ar(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let l = a.length;
            Sd(t, e, l);
          } else n.unshift(s), Sd(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function Sd(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function I1(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new b(-301, !1);
      n.push(e[i], o);
    }
  }
}
function M1(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    ar(e) && (r[""] = t);
  }
}
function T1(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function x1(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = Br(i.type, !0)),
    s = new Hr(o, ar(i), y);
  (t.blueprint[n] = s), (r[n] = s), b1(t, e, n, Hy(t, r, i.hostVars, an), i);
}
function A1(t, e, r) {
  let n = Pt(e, t),
    i = qy(r),
    o = t[Vn].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = Il(
    t,
    Sl(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function N1(t, e, r, n, i, o) {
  let s = Pt(t, e);
  O1(e[be], s, o, t.value, r, n, i);
}
function O1(t, e, r, n, i, o, s) {
  if (o == null) t.removeAttribute(e, i, r);
  else {
    let a = s == null ? $r(o) : s(o, n || "", i);
    t.setAttribute(e, i, a, r);
  }
}
function P1(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let l = s[a++],
        c = s[a++],
        u = s[a++],
        d = s[a++];
      Uy(n, r, l, c, u, d);
    }
}
function R1(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function Ky(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function Yy(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = xt(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          cf(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      xt(n);
    }
  }
}
function Il(t, e) {
  return t[Mo] ? (t[fm][tn] = e) : (t[Mo] = e), (t[fm] = e), e;
}
function Id(t, e, r) {
  cf(0);
  let n = xt(null);
  try {
    e(t, r);
  } finally {
    xt(n);
  }
}
function Zy(t) {
  return t[Io] || (t[Io] = []);
}
function Jy(t) {
  return t.cleanup || (t.cleanup = []);
}
function Xy(t, e) {
  let r = t[Ai],
    n = r ? r.get(Bt, null) : null;
  n && n.handleError(e);
}
function Ff(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      l = r[o++],
      c = e[s],
      u = t.data[s];
    Uy(u, c, n, a, l, i);
  }
}
function e0(t, e, r) {
  let n = hv(e, t);
  zS(t[be], n, r);
}
function F1(t, e) {
  let r = ur(e, t),
    n = r[z];
  k1(n, r);
  let i = r[Ot];
  i !== null && r[Ln] === null && (r[Ln] = yf(i, r[Ai])), kf(n, r, r[nn]);
}
function k1(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function kf(t, e, r) {
  uf(e);
  try {
    let n = t.viewQuery;
    n !== null && Id(1, n, r);
    let i = t.template;
    i !== null && zy(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[jn]?.finishViewCreation(t),
      t.staticContentQueries && Yy(t, e),
      t.staticViewQueries && Id(2, t.viewQuery, r);
    let o = t.components;
    o !== null && L1(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[B] &= -5), df();
  }
}
function L1(t, e) {
  for (let r = 0; r < e.length; r++) F1(t, e[r]);
}
function V1(t, e, r, n) {
  let i = e.tView,
    s = t[B] & 4096 ? 4096 : 16,
    a = Sl(
      t,
      i,
      r,
      s,
      null,
      e,
      null,
      null,
      null,
      n?.injector ?? null,
      n?.dehydratedView ?? null
    ),
    l = t[e.index];
  a[Vo] = l;
  let c = t[jn];
  return c !== null && (a[jn] = c.createEmbeddedView(i)), kf(i, a, r), a;
}
function Om(t, e) {
  return !e || e.firstChild === null || Va(t);
}
function j1(t, e, r, n = !0) {
  let i = e[z];
  if ((QS(i, e, t, r), n)) {
    let s = Ed(r, t),
      a = e[be],
      l = Mf(a, t[$n]);
    l !== null && GS(i, t[on], a, e, l, s);
  }
  let o = e[Ln];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Qa(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(rn(o)), bn(o) && $1(o, n);
    let s = r.type;
    if (s & 8) Qa(t, e, r.child, n);
    else if (s & 32) {
      let a = Sf(r, e),
        l;
      for (; (l = a()); ) n.push(l);
    } else if (s & 16) {
      let a = Fy(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let l = Ao(e[$t]);
        Qa(l[z], l, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function $1(t, e) {
  for (let r = yt; r < t.length; r++) {
    let n = t[r],
      i = n[z].firstChild;
    i !== null && Qa(n[z], n, i, e);
  }
  t[$n] !== t[Ot] && e.push(t[$n]);
}
var t0 = [];
function B1(t) {
  return t[Vr] ?? U1(t);
}
function U1(t) {
  let e = t0.pop() ?? Object.create(z1);
  return (e.lView = t), e;
}
function H1(t) {
  t.lView[Vr] !== t && ((t.lView = null), t0.push(t));
}
var z1 = te(I({}, Mg), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    xo(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[Vr] = this;
  },
});
function n0(t) {
  return i0(t[Mo]);
}
function r0(t) {
  return i0(t[tn]);
}
function i0(t) {
  for (; t !== null && !bn(t); ) t = t[tn];
  return t;
}
var o0 = 100;
function s0(t, e = !0, r = 0) {
  let n = t[Vn],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    q1(t, r);
  } catch (s) {
    throw (e && Xy(t, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function q1(t, e) {
  Md(t, e);
  let r = 0;
  for (; af(t); ) {
    if (r === o0) throw new b(103, !1);
    r++, Md(t, 1);
  }
}
function G1(t, e, r, n) {
  let i = e[B];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Vn].inlineEffectRunner?.flush(), uf(e);
  let s = null,
    a = null;
  !o && W1(t) && ((a = B1(e)), (s = Tg(a)));
  try {
    gv(e), H_(t.bindingStartIndex), r !== null && zy(t, e, r, 2, n);
    let l = (i & 3) === 3;
    if (!o)
      if (l) {
        let d = t.preOrderCheckHooks;
        d !== null && Aa(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Na(e, d, 0, null), Hu(e, 0);
      }
    if ((Q1(e), a0(e, 0), t.contentQueries !== null && Yy(t, e), !o))
      if (l) {
        let d = t.contentCheckHooks;
        d !== null && Aa(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Na(e, d, 1), Hu(e, 1);
      }
    c1(t, e);
    let c = t.components;
    c !== null && c0(e, c, 0);
    let u = t.viewQuery;
    if ((u !== null && Id(2, u, n), !o))
      if (l) {
        let d = t.viewCheckHooks;
        d !== null && Aa(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Na(e, d, 2), Hu(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[ju])) {
      for (let d of e[ju]) d();
      e[ju] = null;
    }
    o || (e[B] &= -73);
  } catch (l) {
    throw (xo(e), l);
  } finally {
    a !== null && (xg(a, s), H1(a)), df();
  }
}
function W1(t) {
  return t.type !== 2;
}
function a0(t, e) {
  for (let r = n0(t); r !== null; r = r0(r))
    for (let n = yt; n < r.length; n++) {
      let i = r[n];
      l0(i, e);
    }
}
function Q1(t) {
  for (let e = n0(t); e !== null; e = r0(e)) {
    if (!(e[B] & nf.HasTransplantedViews)) continue;
    let r = e[Ni];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[Ye];
      N_(i);
    }
  }
}
function K1(t, e, r) {
  let n = ur(e, t);
  l0(n, r);
}
function l0(t, e) {
  sf(t) && Md(t, e);
}
function Md(t, e) {
  let n = t[z],
    i = t[B],
    o = t[Vr],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && pu(o))),
    o && (o.dirty = !1),
    (t[B] &= -9217),
    s)
  )
    G1(n, t, n.template, t[nn]);
  else if (i & 8192) {
    a0(t, 1);
    let a = n.components;
    a !== null && c0(t, a, 1);
  }
}
function c0(t, e, r) {
  for (let n = 0; n < e.length; n++) K1(t, e[n], r);
}
function Lf(t) {
  for (t[Vn].changeDetectionScheduler?.notify(); t; ) {
    t[B] |= 64;
    let e = Ao(t);
    if (dv(t) && !e) return t;
    t = e;
  }
  return null;
}
var qr = class {
    get rootNodes() {
      let e = this._lView,
        r = e[z];
      return Qa(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[nn];
    }
    set context(e) {
      this._lView[nn] = e;
    }
    get destroyed() {
      return (this._lView[B] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[Ye];
        if (bn(e)) {
          let r = e[ka],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (_d(e, n), La(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      Py(this._lView[z], this._lView);
    }
    onDestroy(e) {
      mv(this._lView, e);
    }
    markForCheck() {
      Lf(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[B] &= -129;
    }
    reattach() {
      id(this._lView), (this._lView[B] |= 128);
    }
    detectChanges() {
      (this._lView[B] |= 1024), s0(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new b(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Ny(this._lView[z], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new b(902, !1);
      (this._appRef = e), id(this._lView);
    }
  },
  Bn = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = J1;
    let t = e;
    return t;
  })(),
  Y1 = Bn,
  Z1 = class extends Y1 {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = V1(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new qr(i);
    }
  };
function J1() {
  return Ml(ot(), Q());
}
function Ml(t, e) {
  return t.type & 4 ? new Z1(e, t, Li(t, e)) : null;
}
function u0(t) {
  let e = t[To] ?? [],
    n = t[Ye][be];
  for (let i of e) X1(i, n);
  t[To] = Nt;
}
function X1(t, e) {
  let r = 0,
    n = t.firstChild;
  if (n) {
    let i = t.data[$a];
    for (; r < i; ) {
      let o = n.nextSibling;
      ky(e, n, !1), (n = o), r++;
    }
  }
}
function d0(t) {
  u0(t);
  for (let e = yt; e < t.length; e++) Ka(t[e]);
}
function Ka(t) {
  let e = t[z];
  for (let r = Ze; r < e.bindingStartIndex; r++)
    if (bn(t[r])) {
      let n = t[r];
      d0(n);
    } else kn(t[r]) && Ka(t[r]);
}
function eI(t) {
  let e = t._views;
  for (let r of e) {
    let n = RE(r);
    if (n !== null && n[Ot] !== null)
      if (kn(n)) Ka(n);
      else {
        let i = n[Ot];
        Ka(i), d0(n);
      }
  }
}
var tI = new RegExp(`^(\\d+)*(${Uv}|${Bv})*(.*)`);
function nI(t) {
  let e = t.match(tI),
    [r, n, i, o] = e,
    s = n ? parseInt(n, 10) : i,
    a = [];
  for (let [l, c, u] of o.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(c, d);
  }
  return [s, ...a];
}
function rI(t) {
  return !t.prev && t.parent?.type === 8;
}
function Wu(t) {
  return t.index - Ze;
}
function Tl(t, e, r, n) {
  let i = null,
    o = Wu(n),
    s = t.data[TE];
  if (s?.[o]) i = oI(s[o], r);
  else if (e.firstChild === n) i = t.firstChild;
  else {
    let a = n.prev === null,
      l = n.prev ?? n.parent;
    if (rI(n)) {
      let c = Wu(n.parent);
      i = fd(t, c);
    } else {
      let c = Pt(l, r);
      if (a) i = c.firstChild;
      else {
        let u = Wu(l),
          d = fd(t, u);
        if (l.type === 2 && d) {
          let g = Df(t, u) + 1;
          i = xl(g, d);
        } else i = c.nextSibling;
      }
    }
  }
  return i;
}
function xl(t, e) {
  let r = e;
  for (let n = 0; n < t; n++) r = r.nextSibling;
  return r;
}
function iI(t, e) {
  let r = t;
  for (let n = 0; n < e.length; n += 2) {
    let i = e[n],
      o = e[n + 1];
    for (let s = 0; s < o; s++)
      switch (i) {
        case dd.FirstChild:
          r = r.firstChild;
          break;
        case dd.NextSibling:
          r = r.nextSibling;
          break;
      }
  }
  return r;
}
function oI(t, e) {
  let [r, ...n] = nI(t),
    i;
  if (r === Bv) i = e[$t][Ot];
  else if (r === Uv) i = US(e[$t][Ot]);
  else {
    let o = Number(r);
    i = rn(e[o + Ze]);
  }
  return iI(i, n);
}
function sI(t, e) {
  let r = [];
  for (let n of e)
    for (let i = 0; i < (n[Hv] ?? 1); i++) {
      let o = { data: n, firstChild: null };
      n[$a] > 0 && ((o.firstChild = t), (t = xl(n[$a], t))), r.push(o);
    }
  return [t, r];
}
var f0 = () => null;
function aI(t, e) {
  let r = t[To];
  return !e || r === null || r.length === 0
    ? null
    : r[0].data[ME] === e
    ? r.shift()
    : (u0(t), null);
}
function lI() {
  f0 = aI;
}
function Pm(t, e) {
  return f0(t, e);
}
var Po = class {},
  Td = class {},
  Ya = class {};
function cI(t) {
  let e = Error(`No component factory found for ${ct(t)}.`);
  return (e[uI] = t), e;
}
var uI = "ngComponent";
var xd = class {
    resolveComponentFactory(e) {
      throw cI(e);
    }
  },
  Al = (() => {
    let e = class e {};
    e.NULL = new xd();
    let t = e;
    return t;
  })(),
  Gr = class {},
  bt = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => dI();
    let t = e;
    return t;
  })();
function dI() {
  let t = Q(),
    e = ot(),
    r = ur(e.index, t);
  return (kn(r) ? r : t)[be];
}
var fI = (() => {
    let e = class e {};
    e.ɵprov = _({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  Qu = {};
function hI(t) {
  return typeof t == "function" && t[hu] !== void 0;
}
var Rm = new Set();
function Jr(t) {
  Rm.has(t) ||
    (Rm.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function h0(t) {
  return hI(t) && typeof t.set == "function";
}
function p0(t) {
  return Vf(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function pI(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function Vf(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var Ad = class {
    constructor() {}
    supports(e) {
      return p0(e);
    }
    create(e) {
      return new Nd(e);
    }
  },
  gI = (t, e) => e,
  Nd = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || gI);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < Fm(n, i, o)) ? r : n,
          a = Fm(s, i, o),
          l = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let c = a - i,
            u = l - i;
          if (c != u) {
            for (let p = 0; p < c; p++) {
              let g = p < o.length ? o[p] : (o[p] = 0),
                v = g + p;
              u <= v && v < c && (o[p] = g + 1);
            }
            let d = s.previousIndex;
            o[d] = u - c;
          }
        }
        a !== l && e(s, a, l);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !p0(e))) throw new b(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          pI(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Od(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Za()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Za()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Od = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Pd = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  Za = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new Pd()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Fm(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
var Rd = class {
    constructor() {}
    supports(e) {
      return e instanceof Map || Vf(e);
    }
    create() {
      return new Fd();
    }
  },
  Fd = class {
    constructor() {
      (this._records = new Map()),
        (this._mapHead = null),
        (this._appendAfter = null),
        (this._previousMapHead = null),
        (this._changesHead = null),
        (this._changesTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(e) {
      let r;
      for (r = this._mapHead; r !== null; r = r._next) e(r);
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousMapHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachChangedItem(e) {
      let r;
      for (r = this._changesHead; r !== null; r = r._nextChanged) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    diff(e) {
      if (!e) e = new Map();
      else if (!(e instanceof Map || Vf(e))) throw new b(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(e, (n, i) => {
          if (r && r.key === i)
            this._maybeAddToChanges(r, n),
              (this._appendAfter = r),
              (r = r._next);
          else {
            let o = this._getOrCreateRecordForKey(i, n);
            r = this._insertBeforeOrAppend(r, o);
          }
        }),
        r)
      ) {
        r._prev && (r._prev._next = null), (this._removalsHead = r);
        for (let n = r; n !== null; n = n._nextRemoved)
          n === this._mapHead && (this._mapHead = null),
            this._records.delete(n.key),
            (n._nextRemoved = n._next),
            (n.previousValue = n.currentValue),
            (n.currentValue = null),
            (n._prev = null),
            (n._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(e, r) {
      if (e) {
        let n = e._prev;
        return (
          (r._next = e),
          (r._prev = n),
          (e._prev = r),
          n && (n._next = r),
          e === this._mapHead && (this._mapHead = r),
          (this._appendAfter = e),
          e
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = r), (r._prev = this._appendAfter))
          : (this._mapHead = r),
        (this._appendAfter = r),
        null
      );
    }
    _getOrCreateRecordForKey(e, r) {
      if (this._records.has(e)) {
        let i = this._records.get(e);
        this._maybeAddToChanges(i, r);
        let o = i._prev,
          s = i._next;
        return (
          o && (o._next = s),
          s && (s._prev = o),
          (i._next = null),
          (i._prev = null),
          i
        );
      }
      let n = new kd(e);
      return (
        this._records.set(e, n),
        (n.currentValue = r),
        this._addToAdditions(n),
        n
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (
          this._previousMapHead = this._mapHead, e = this._previousMapHead;
          e !== null;
          e = e._next
        )
          e._nextPrevious = e._next;
        for (e = this._changesHead; e !== null; e = e._nextChanged)
          e.previousValue = e.currentValue;
        for (e = this._additionsHead; e != null; e = e._nextAdded)
          e.previousValue = e.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(e, r) {
      Object.is(r, e.currentValue) ||
        ((e.previousValue = e.currentValue),
        (e.currentValue = r),
        this._addToChanges(e));
    }
    _addToAdditions(e) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = e)
        : ((this._additionsTail._nextAdded = e), (this._additionsTail = e));
    }
    _addToChanges(e) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = e)
        : ((this._changesTail._nextChanged = e), (this._changesTail = e));
    }
    _forEach(e, r) {
      e instanceof Map
        ? e.forEach(r)
        : Object.keys(e).forEach((n) => r(e[n], n));
    }
  },
  kd = class {
    constructor(e) {
      (this.key = e),
        (this.previousValue = null),
        (this.currentValue = null),
        (this._nextPrevious = null),
        (this._next = null),
        (this._prev = null),
        (this._nextAdded = null),
        (this._nextRemoved = null),
        (this._nextChanged = null);
    }
  };
function km() {
  return new jf([new Ad()]);
}
var jf = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || km()),
        deps: [[e, new ml(), new zo()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new b(901, !1);
    }
  };
  e.ɵprov = _({ token: e, providedIn: "root", factory: km });
  let t = e;
  return t;
})();
function Lm() {
  return new $f([new Rd()]);
}
var $f = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || Lm()),
        deps: [[e, new ml(), new zo()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i) return i;
      throw new b(901, !1);
    }
  };
  e.ɵprov = _({ token: e, providedIn: "root", factory: Lm });
  let t = e;
  return t;
})();
var En = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = mI;
  let t = e;
  return t;
})();
function mI(t) {
  return vI(ot(), Q(), (t & 16) === 16);
}
function vI(t, e, r) {
  if (jo(t) && !r) {
    let n = ur(t.index, e);
    return new qr(n, n);
  } else if (t.type & 47) {
    let n = e[$t];
    return new qr(n, e);
  }
  return null;
}
var g0 = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = yI), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  Ld = class extends g0 {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return mv(this._lView, e), () => P_(this._lView, e);
    }
  };
function yI() {
  return new Ld(Q());
}
function Vm(...t) {}
function DI() {
  let t = typeof Pe.requestAnimationFrame == "function",
    e = Pe[t ? "requestAnimationFrame" : "setTimeout"],
    r = Pe[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var ee = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new ae(!1)),
        (this.onMicrotaskEmpty = new ae(!1)),
        (this.onStable = new ae(!1)),
        (this.onError = new ae(!1)),
        typeof Zone > "u")
      )
        throw new b(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = DI().nativeRequestAnimationFrame),
        CI(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new b(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new b(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, wI, Vm, Vm);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  wI = {};
function Bf(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function bI(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Pe,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Vd(t),
                (t.isCheckStableRunning = !0),
                Bf(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Vd(t));
}
function CI(t) {
  let e = () => {
    bI(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (_I(a)) return r.invokeTask(i, o, s, a);
      try {
        return jm(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          $m(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, l) => {
      try {
        return jm(t), r.invoke(i, o, s, a, l);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), $m(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), Vd(t), Bf(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function Vd(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function jm(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function $m(t) {
  t._nesting--, Bf(t);
}
var jd = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new ae()),
      (this.onMicrotaskEmpty = new ae()),
      (this.onStable = new ae()),
      (this.onError = new ae());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function _I(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function EI(t = "zone.js", e) {
  return t === "noop" ? new jd() : t === "zone.js" ? new ee(e) : t;
}
var Ii = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Ii || {}),
  SI = { destroy() {} };
function Uf(t, e) {
  !e && YE(Uf);
  let r = e?.injector ?? C(Ut);
  if (!Co(r)) return SI;
  Jr("NgAfterNextRender");
  let n = r.get(Hf),
    i = (n.handler ??= new Bd()),
    o = e?.phase ?? Ii.MixedReadWrite,
    s = () => {
      i.unregister(l), a();
    },
    a = r.get(g0).onDestroy(s),
    l = new $d(r, o, () => {
      s(), t();
    });
  return i.register(l), { destroy: s };
}
var $d = class {
    constructor(e, r, n) {
      (this.phase = r),
        (this.callbackFn = n),
        (this.zone = e.get(ee)),
        (this.errorHandler = e.get(Bt, null, { optional: !0 }));
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  Bd = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Ii.EarlyRead]: new Set(),
          [Ii.Write]: new Set(),
          [Ii.MixedReadWrite]: new Set(),
          [Ii.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Hf = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = _({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function Ja(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = sm(i, a);
      else if (o == 2) {
        let l = a,
          c = e[++s];
        n = sm(n, l + ": " + c + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Xa = class extends Al {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = sr(e);
    return new Ri(r, this.ngModule);
  }
};
function Bm(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function II(t) {
  let e = t.toLowerCase();
  return e === "svg" ? fv : e === "math" ? I_ : null;
}
var Ud = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = hl(n);
      let i = this.injector.get(e, Qu, n);
      return i !== Qu || r === Qu ? i : this.parentInjector.get(e, r, n);
    }
  },
  Ri = class extends Ya {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = Bm(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return Bm(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = b_(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      i = i || this.ngModule;
      let o = i instanceof ut ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new Ud(e, o) : e,
        a = s.get(Gr, null);
      if (a === null) throw new b(407, !1);
      let l = s.get(fI, null),
        c = s.get(Hf, null),
        u = s.get(Po, null),
        d = {
          rendererFactory: a,
          sanitizer: l,
          inlineEffectRunner: null,
          afterRenderEventManager: c,
          changeDetectionScheduler: u,
        },
        p = a.createRenderer(null, this.componentDef),
        g = this.componentDef.selectors[0][0] || "div",
        v = n ? f1(p, n, this.componentDef.encapsulation, s) : If(p, g, II(g)),
        S = 512;
      this.componentDef.signals
        ? (S |= 4096)
        : this.componentDef.onPush || (S |= 16);
      let x = null;
      v !== null && (x = yf(v, s, !0));
      let T = Of(0, null, null, 1, 0, null, null, null, null, null, null),
        j = Sl(null, T, null, S, null, null, d, p, s, null, x);
      uf(j);
      let ne, $;
      try {
        let ye = this.componentDef,
          _e,
          Ee = null;
        ye.findHostDirectiveDefs
          ? ((_e = []),
            (Ee = new Map()),
            ye.findHostDirectiveDefs(ye, _e, Ee),
            _e.push(ye))
          : (_e = [ye]);
        let rt = MI(j, v),
          Pn = TI(rt, v, ye, _e, j, d, p);
        ($ = pv(T, Ze)),
          v && NI(p, ye, v, n),
          r !== void 0 && OI($, this.ngContentSelectors, r),
          (ne = AI(Pn, ye, _e, Ee, j, [PI])),
          kf(T, j, null);
      } finally {
        df();
      }
      return new Hd(this.componentType, ne, Li($, j), j, $);
    }
  },
  Hd = class extends Td {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new qr(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        Ff(o[z], o, i, e, r), this.previousInputValues.set(e, r);
        let s = ur(this._tNode.index, o);
        Lf(s);
      }
    }
    get injector() {
      return new Lr(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function MI(t, e) {
  let r = t[z],
    n = Ze;
  return (t[n] = e), Wo(r, n, 2, "#host", null);
}
function TI(t, e, r, n, i, o, s) {
  let a = i[z];
  xI(n, t, e, s);
  let l = null;
  e !== null && (l = yf(e, i[Ai]));
  let c = o.rendererFactory.createRenderer(e, r),
    u = 16;
  r.signals ? (u = 4096) : r.onPush && (u = 64);
  let d = Sl(i, qy(r), null, u, i[t.index], t, o, c, null, null, l);
  return (
    a.firstCreatePass && Sd(a, t, n.length - 1), Il(i, d), (i[t.index] = d)
  );
}
function xI(t, e, r, n) {
  for (let i of t) e.mergedAttrs = So(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Ja(e, e.mergedAttrs, !0), r !== null && jy(n, r, e));
}
function AI(t, e, r, n, i, o) {
  let s = ot(),
    a = i[z],
    l = Pt(s, i);
  Wy(a, i, s, r, null, n);
  for (let u = 0; u < r.length; u++) {
    let d = s.directiveStart + u,
      p = zr(i, a, d, s);
    lr(p, i);
  }
  Qy(a, i, s), l && lr(l, i);
  let c = zr(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[nn] = i[nn] = c), o !== null)) for (let u of o) u(c, e);
  return xf(a, s, i), c;
}
function NI(t, e, r, n) {
  if (n) rd(t, r, ["ng-version", "17.2.3"]);
  else {
    let { attrs: i, classes: o } = C_(e.selectors[0]);
    i && rd(t, r, i), o && o.length > 0 && Vy(t, r, o.join(" "));
  }
}
function OI(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function PI() {
  let t = ot();
  yl(Q()[z], t);
}
var zn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = RI;
  let t = e;
  return t;
})();
function RI() {
  let t = ot();
  return v0(t, Q());
}
var FI = zn,
  m0 = class extends FI {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Li(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Lr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Cf(this._hostTNode, this._hostLView);
      if (oy(e)) {
        let r = Ha(e, this._hostLView),
          n = Ua(e),
          i = r[z].data[n + 8];
        return new Lr(i, r);
      } else return new Lr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = Um(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - yt;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = Pm(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, Om(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !JE(e),
        a;
      if (s) a = r;
      else {
        let v = r || {};
        (a = v.index),
          (n = v.injector),
          (i = v.projectableNodes),
          (o = v.environmentInjector || v.ngModuleRef);
      }
      let l = s ? e : new Ri(sr(e)),
        c = n || this.parentInjector;
      if (!o && l.ngModule == null) {
        let S = (s ? c : this.parentInjector).get(ut, null);
        S && (o = S);
      }
      let u = sr(l.componentType ?? {}),
        d = Pm(this._lContainer, u?.id ?? null),
        p = d?.firstChild ?? null,
        g = l.create(c, i, p, o);
      return this.insertImpl(g.hostView, a, Om(this._hostTNode, d)), g;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (A_(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let l = i[Ye],
            c = new m0(l, l[on], l[Ye]);
          c.detach(c.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return j1(s, i, o, n), e.attachToViewContainerRef(), xv(Ku(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = Um(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = _d(this._lContainer, r);
      n && (La(Ku(this._lContainer), r), Py(n[z], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = _d(this._lContainer, r);
      return n && La(Ku(this._lContainer), r) != null ? new qr(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function Um(t) {
  return t[ka];
}
function Ku(t) {
  return t[ka] || (t[ka] = []);
}
function v0(t, e) {
  let r,
    n = e[t.index];
  return (
    bn(n) ? (r = n) : ((r = Ky(n, e, null, t)), (e[t.index] = r), Il(e, r)),
    y0(r, e, t, n),
    new m0(r, t, e)
  );
}
function kI(t, e) {
  let r = t[be],
    n = r.createComment(""),
    i = Pt(e, t),
    o = Mf(r, i);
  return Wa(r, o, n, t1(r, i), !1), n;
}
var y0 = D0,
  zf = () => !1;
function LI(t, e, r) {
  return zf(t, e, r);
}
function D0(t, e, r, n) {
  if (t[$n]) return;
  let i;
  r.type & 8 ? (i = rn(n)) : (i = kI(e, r)), (t[$n] = i);
}
function VI(t, e, r) {
  if (t[$n] && t[To]) return !0;
  let n = r[Ln],
    i = e.index - Ze;
  if (!n || aE(e) || gl(n, i)) return !1;
  let s = fd(n, i),
    a = n.data[vf]?.[i],
    [l, c] = sI(s, a);
  return (t[$n] = l), (t[To] = c), !0;
}
function jI(t, e, r, n) {
  zf(t, r, e) || D0(t, e, r, n);
}
function $I() {
  (y0 = jI), (zf = VI);
}
var zd = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  qd = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let o = 0; o < n; o++) {
          let s = r.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++)
        qf(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  Gd = class {
    constructor(e, r, n = null) {
      (this.flags = r),
        (this.read = n),
        typeof e == "string" ? (this.predicate = QI(e)) : (this.predicate = e);
    }
  },
  Wd = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          o = this.getByIndex(n).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = n), r !== null ? r.push(o) : (r = [o]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  Qd = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, r),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          this.matchTNodeWithReadOption(e, r, BI(r, o)),
            this.matchTNodeWithReadOption(e, r, Oa(r, e, o, !1, !1));
        }
      else
        n === Bn
          ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1)
          : this.matchTNodeWithReadOption(e, r, Oa(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === He || i === zn || (i === Bn && r.type & 4))
            this.addMatch(r.index, -2);
          else {
            let o = Oa(r, e, i, !1, !1);
            o !== null && this.addMatch(r.index, o);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function BI(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function UI(t, e) {
  return t.type & 11 ? Li(t, e) : t.type & 4 ? Ml(t, e) : null;
}
function HI(t, e, r, n) {
  return r === -1 ? UI(e, t) : r === -2 ? zI(t, e, n) : zr(t, t[z], r, e);
}
function zI(t, e, r) {
  if (r === He) return Li(e, t);
  if (r === Bn) return Ml(e, t);
  if (r === zn) return v0(e, t);
}
function w0(t, e, r, n) {
  let i = e[jn].queries[n];
  if (i.matches === null) {
    let o = t.data,
      s = r.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let u = o[c];
        a.push(HI(e, u, s[l + 1], r.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function Kd(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    o = i.matches;
  if (o !== null) {
    let s = w0(t, e, i, r);
    for (let a = 0; a < o.length; a += 2) {
      let l = o[a];
      if (l > 0) n.push(s[a / 2]);
      else {
        let c = o[a + 1],
          u = e[-l];
        for (let d = yt; d < u.length; d++) {
          let p = u[d];
          p[Vo] === p[Ye] && Kd(p[z], p, c, n);
        }
        if (u[Ni] !== null) {
          let d = u[Ni];
          for (let p = 0; p < d.length; p++) {
            let g = d[p];
            Kd(g[z], g, c, n);
          }
        }
      }
    }
  }
  return n;
}
function qI(t, e) {
  return t[jn].queries[e].queryList;
}
function GI(t, e, r) {
  let n = new sd((r & 4) === 4);
  return (
    m1(t, e, n, n.destroy), (e[jn] ??= new qd()).queries.push(new zd(n)) - 1
  );
}
function WI(t, e, r, n) {
  let i = Ue();
  if (i.firstCreatePass) {
    let o = ot();
    KI(i, new Gd(e, r, n), o.index),
      YI(i, t),
      (r & 2) === 2 && (i.staticContentQueries = !0);
  }
  return GI(i, Q(), r);
}
function QI(t) {
  return t.split(",").map((e) => e.trim());
}
function KI(t, e, r) {
  t.queries === null && (t.queries = new Wd()), t.queries.track(new Qd(e, r));
}
function YI(t, e) {
  let r = t.contentQueries || (t.contentQueries = []),
    n = r.length ? r[r.length - 1] : -1;
  e !== n && r.push(t.queries.length - 1, e);
}
function qf(t, e) {
  return t.queries.getByIndex(e);
}
function ZI(t, e) {
  let r = t[z],
    n = qf(r, e);
  return n.crossesNgTemplate ? Kd(r, t, e, []) : w0(r, t, n, e);
}
function JI(t) {
  let e = [],
    r = new Map();
  function n(i) {
    let o = r.get(i);
    if (!o) {
      let s = t(i);
      r.set(i, (o = s.then(nM)));
    }
    return o;
  }
  return (
    el.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          n(i.templateUrl).then((c) => {
            i.template = c;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let c = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((d, p) => {
          a.push(""),
            s.push(
              n(d).then((g) => {
                (a[c + p] = g),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            n(i.styleUrl).then((c) => {
              a.push(c), (i.styleUrl = void 0);
            })
          );
      let l = Promise.all(s).then(() => rM(o));
      e.push(l);
    }),
    eM(),
    Promise.all(e).then(() => {})
  );
}
var el = new Map(),
  XI = new Set();
function eM() {
  let t = el;
  return (el = new Map()), t;
}
function tM() {
  return el.size === 0;
}
function nM(t) {
  return typeof t == "string" ? t : t.text();
}
function rM(t) {
  XI.delete(t);
}
function iM(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Rt(t) {
  let e = iM(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (ar(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new b(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = Sa(t.inputs)),
          (s.inputTransforms = Sa(t.inputTransforms)),
          (s.declaredInputs = Sa(t.declaredInputs)),
          (s.outputs = Sa(t.outputs));
        let a = i.hostBindings;
        a && cM(t, a);
        let l = i.viewQuery,
          c = i.contentQueries;
        if (
          (l && aM(t, l),
          c && lM(t, c),
          oM(t, i),
          a_(t.outputs, i.outputs),
          ar(i) && i.data.animation)
        ) {
          let u = t.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Rt && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  sM(n);
}
function oM(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function sM(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = So(i.hostAttrs, (r = So(r, i.hostAttrs))));
  }
}
function Sa(t) {
  return t === xi ? {} : t === Nt ? [] : t;
}
function aM(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function lM(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function cM(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function Gf(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[3] && (r[n] = i[3]);
    }
  t.inputTransforms = r;
}
var cr = class {},
  Ro = class {};
var tl = class extends cr {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Xa(this));
      let i = sv(e);
      (this._bootstrapComponents = Ty(i.bootstrap)),
        (this._r3Injector = py(
          e,
          r,
          [
            { provide: cr, useValue: this },
            { provide: Al, useValue: this.componentFactoryResolver },
            ...n,
          ],
          ct(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  nl = class extends Ro {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new tl(this.moduleType, e, []);
    }
  };
function uM(t, e, r) {
  return new tl(t, e, r);
}
var Yd = class extends cr {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Xa(this)),
      (this.instance = null);
    let r = new Oo(
      [
        ...e.providers,
        { provide: cr, useValue: this },
        { provide: Al, useValue: this.componentFactoryResolver },
      ],
      e.parent || bf(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Nl(t, e, r = null) {
  return new Yd({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Xr = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new nt(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Qo(t, e, r) {
  return (t[e] = r);
}
function b0(t, e) {
  return t[e];
}
function Un(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function rl(t, e, r, n) {
  let i = Un(t, e, r);
  return Un(t, e + 1, n) || i;
}
function C0(t, e, r, n, i, o) {
  let s = rl(t, e, r, n);
  return rl(t, e + 2, i, o) || s;
}
function dM(t, e, r, n, i, o, s, a, l) {
  let c = e.consts,
    u = Wo(e, t, 4, s || null, Oi(c, a));
  Rf(e, r, u, Oi(c, l)), yl(e, u);
  let d = (u.tView = Of(
    2,
    u,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, u), (d.queries = e.queries.embeddedTView(u))),
    u
  );
}
function k(t, e, r, n, i, o, s, a) {
  let l = Q(),
    c = Ue(),
    u = t + Ze,
    d = c.firstCreatePass ? dM(u, c, l, e, r, n, i, o, s) : c.data[u];
  Qr(d, !1);
  let p = _0(c, l, d, t);
  dl() && _l(c, l, p, d), lr(p, l);
  let g = Ky(p, l, p, d);
  return (
    (l[u] = g),
    Il(l, g),
    LI(g, d, l),
    ll(d) && Af(c, l, d),
    s != null && Nf(l, d, a),
    k
  );
}
var _0 = E0;
function E0(t, e, r, n) {
  return dr(!0), e[be].createComment("");
}
function fM(t, e, r, n) {
  let i = e[Ln],
    o = !i || $o() || gl(i, n);
  if ((dr(o), o)) return E0(t, e, r, n);
  let s = i.data[IE]?.[n] ?? null;
  s !== null &&
    r.tView !== null &&
    r.tView.ssrId === null &&
    (r.tView.ssrId = s);
  let a = Tl(i, t, e, r);
  pl(i, n, a);
  let l = Df(i, n);
  return xl(l, a);
}
function hM() {
  _0 = fM;
}
function hr(t, e, r, n) {
  let i = Q(),
    o = cl();
  if (Un(i, o, e)) {
    let s = Ue(),
      a = ul();
    N1(a, i, t, e, r, n);
  }
  return hr;
}
function S0(t, e, r, n) {
  return Un(t, cl(), r) ? e + $r(r) + n : an;
}
function pM(t, e, r, n, i, o) {
  let s = U_(),
    a = rl(t, s, r, i);
  return wv(2), a ? e + $r(r) + n + $r(i) + o : an;
}
function Ia(t, e) {
  return (t << 17) | (e << 2);
}
function Wr(t) {
  return (t >> 17) & 32767;
}
function gM(t) {
  return (t & 2) == 2;
}
function mM(t, e) {
  return (t & 131071) | (e << 17);
}
function Zd(t) {
  return t | 2;
}
function Fi(t) {
  return (t & 131068) >> 2;
}
function Yu(t, e) {
  return (t & -131069) | (e << 2);
}
function vM(t) {
  return (t & 1) === 1;
}
function Jd(t) {
  return t | 1;
}
function yM(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = Wr(s),
    l = Fi(s);
  t[n] = r;
  let c = !1,
    u;
  if (Array.isArray(r)) {
    let d = r;
    (u = d[1]), (u === null || Bo(d, u) > 0) && (c = !0);
  } else u = r;
  if (i)
    if (l !== 0) {
      let p = Wr(t[a + 1]);
      (t[n + 1] = Ia(p, a)),
        p !== 0 && (t[p + 1] = Yu(t[p + 1], n)),
        (t[a + 1] = mM(t[a + 1], n));
    } else
      (t[n + 1] = Ia(a, 0)), a !== 0 && (t[a + 1] = Yu(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = Ia(l, 0)),
      a === 0 ? (a = n) : (t[l + 1] = Yu(t[l + 1], n)),
      (l = n);
  c && (t[n + 1] = Zd(t[n + 1])),
    Hm(t, u, n, !0),
    Hm(t, u, n, !1),
    DM(e, u, t, n, o),
    (s = Ia(a, l)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function DM(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Bo(o, e) >= 0 &&
    (r[n + 1] = Jd(r[n + 1]));
}
function Hm(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? Wr(i) : Fi(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = t[s],
      c = t[s + 1];
    wM(l, e) && ((a = !0), (t[s + 1] = n ? Jd(c) : Zd(c))),
      (s = n ? Wr(c) : Fi(c));
  }
  a && (t[r + 1] = n ? Zd(i) : Jd(i));
}
function wM(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Bo(t, e) >= 0
    : !1;
}
function M(t, e, r) {
  let n = Q(),
    i = cl();
  if (Un(n, i, e)) {
    let o = Ue(),
      s = ul();
    Pf(o, s, n, t, e, n[be], r, !1);
  }
  return M;
}
function zm(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  Ff(t, r, o[s], s, n);
}
function Ol(t, e) {
  return bM(t, e, null, !0), Ol;
}
function bM(t, e, r, n) {
  let i = Q(),
    o = Ue(),
    s = wv(2);
  if ((o.firstUpdatePass && _M(o, t, s, n), e !== an && Un(i, s, e))) {
    let a = o.data[Yr()];
    TM(o, a, i, i[be], t, (i[s + 1] = xM(e, r)), n, s);
  }
}
function CM(t, e) {
  return e >= t.expandoStartIndex;
}
function _M(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[Yr()],
      s = CM(t, r);
    AM(o, n) && e === null && !s && (e = !1),
      (e = EM(i, o, e, n)),
      yM(i, o, e, r, s, n);
  }
}
function EM(t, e, r, n) {
  let i = W_(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = Zu(null, t, e, r, n)), (r = Fo(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = Zu(i, t, e, r, n)), o === null)) {
        let l = SM(t, e, n);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = Zu(null, t, e, l[1], n)),
          (l = Fo(l, e.attrs, n)),
          IM(t, e, n, l));
      } else o = MM(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function SM(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Fi(n) !== 0) return t[Wr(n)];
}
function IM(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[Wr(i)] = n;
}
function MM(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = Fo(n, s, r);
  }
  return Fo(n, e.attrs, r);
}
function Zu(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = Fo(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function Fo(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          nE(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function TM(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let l = t.data,
    c = l[a + 1],
    u = vM(c) ? qm(l, e, r, i, Fi(c), s) : void 0;
  if (!il(u)) {
    il(o) || (gM(c) && (o = qm(l, null, r, i, a, s)));
    let d = hv(Yr(), r);
    a1(n, s, d, i, o);
  }
}
function qm(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let l = t[i],
      c = Array.isArray(l),
      u = c ? l[1] : l,
      d = u === null,
      p = r[i + 1];
    p === an && (p = d ? Nt : void 0);
    let g = d ? $u(p, n) : u === n ? p : void 0;
    if ((c && !il(g) && (g = $u(l, n)), il(g) && ((a = g), s))) return a;
    let v = t[i + 1];
    i = s ? Wr(v) : Fi(v);
  }
  if (e !== null) {
    let l = o ? e.residualClasses : e.residualStyles;
    l != null && (a = $u(l, n));
  }
  return a;
}
function il(t) {
  return t !== void 0;
}
function xM(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = ct(ji(t)))),
    t
  );
}
function AM(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function NM(t, e, r, n, i, o) {
  let s = e.consts,
    a = Oi(s, i),
    l = Wo(e, t, 2, n, a);
  return (
    Rf(e, r, l, Oi(s, o)),
    l.attrs !== null && Ja(l, l.attrs, !1),
    l.mergedAttrs !== null && Ja(l, l.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, l),
    l
  );
}
function f(t, e, r, n) {
  let i = Q(),
    o = Ue(),
    s = Ze + t,
    a = i[be],
    l = o.firstCreatePass ? NM(s, o, i, e, r, n) : o.data[s],
    c = I0(o, i, l, a, e, t);
  i[s] = c;
  let u = ll(l);
  return (
    Qr(l, !0),
    jy(a, c, l),
    (l.flags & 32) !== 32 && dl() && _l(o, i, c, l),
    R_() === 0 && lr(c, i),
    F_(),
    u && (Af(o, i, l), xf(o, l, i)),
    n !== null && Nf(i, l),
    f
  );
}
function h() {
  let t = ot();
  lf() ? Dv() : ((t = t.parent), Qr(t, !1));
  let e = t;
  L_(e) && j_(), k_();
  let r = Ue();
  return (
    r.firstCreatePass && (yl(r, t), rf(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      oS(e) &&
      zm(r, e, Q(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      sS(e) &&
      zm(r, e, Q(), e.stylesWithoutHost, !1),
    h
  );
}
function E(t, e, r, n) {
  return f(t, e, r, n), h(), E;
}
var I0 = (t, e, r, n, i, o) => (dr(!0), If(n, i, Mv()));
function OM(t, e, r, n, i, o) {
  let s = e[Ln],
    a = !s || $o() || gl(s, o);
  if ((dr(a), a)) return If(n, i, Mv());
  let l = Tl(s, t, e, r);
  return (
    Gv(s, o) && pl(s, o, l.nextSibling),
    s && (Av(r) || Nv(l)) && jo(r) && (V_(r), Ly(l)),
    l
  );
}
function PM() {
  I0 = OM;
}
function RM(t, e, r, n, i) {
  let o = e.consts,
    s = Oi(o, n),
    a = Wo(e, t, 8, "ng-container", s);
  s !== null && Ja(a, s, !0);
  let l = Oi(o, i);
  return Rf(e, r, a, l), e.queries !== null && e.queries.elementStart(e, a), a;
}
function $i(t, e, r) {
  let n = Q(),
    i = Ue(),
    o = t + Ze,
    s = i.firstCreatePass ? RM(o, i, n, e, r) : i.data[o];
  Qr(s, !0);
  let a = M0(i, n, s, t);
  return (
    (n[o] = a),
    dl() && _l(i, n, a, s),
    lr(a, n),
    ll(s) && (Af(i, n, s), xf(i, s, n)),
    r != null && Nf(n, s),
    $i
  );
}
function Bi() {
  let t = ot(),
    e = Ue();
  return (
    lf() ? Dv() : ((t = t.parent), Qr(t, !1)),
    e.firstCreatePass && (yl(e, t), rf(t) && e.queries.elementEnd(t)),
    Bi
  );
}
var M0 = (t, e, r, n) => (dr(!0), Ay(e[be], ""));
function FM(t, e, r, n) {
  let i,
    o = e[Ln],
    s = !o || $o();
  if ((dr(s), s)) return Ay(e[be], "");
  let a = Tl(o, t, e, r),
    l = LE(o, n);
  return pl(o, n, a), (i = xl(l, a)), i;
}
function kM() {
  M0 = FM;
}
function Je() {
  return Q();
}
var kr = void 0;
function LM(t) {
  let e = t,
    r = Math.floor(Math.abs(t)),
    n = t.toString().replace(/^[^.]*\.?/, "").length;
  return r === 1 && n === 0 ? 1 : 5;
}
var VM = [
    "en",
    [["a", "p"], ["AM", "PM"], kr],
    [["AM", "PM"], kr, kr],
    [
      ["S", "M", "T", "W", "T", "F", "S"],
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ],
    kr,
    [
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    ],
    kr,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", kr, "{1} 'at' {0}", kr],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    LM,
  ],
  Ju = {};
function Ct(t) {
  let e = jM(t),
    r = Gm(e);
  if (r) return r;
  let n = e.split("-")[0];
  if (((r = Gm(n)), r)) return r;
  if (n === "en") return VM;
  throw new b(701, !1);
}
function Gm(t) {
  return (
    t in Ju ||
      (Ju[t] =
        Pe.ng &&
        Pe.ng.common &&
        Pe.ng.common.locales &&
        Pe.ng.common.locales[t]),
    Ju[t]
  );
}
var Ie = (function (t) {
  return (
    (t[(t.LocaleId = 0)] = "LocaleId"),
    (t[(t.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
    (t[(t.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
    (t[(t.DaysFormat = 3)] = "DaysFormat"),
    (t[(t.DaysStandalone = 4)] = "DaysStandalone"),
    (t[(t.MonthsFormat = 5)] = "MonthsFormat"),
    (t[(t.MonthsStandalone = 6)] = "MonthsStandalone"),
    (t[(t.Eras = 7)] = "Eras"),
    (t[(t.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
    (t[(t.WeekendRange = 9)] = "WeekendRange"),
    (t[(t.DateFormat = 10)] = "DateFormat"),
    (t[(t.TimeFormat = 11)] = "TimeFormat"),
    (t[(t.DateTimeFormat = 12)] = "DateTimeFormat"),
    (t[(t.NumberSymbols = 13)] = "NumberSymbols"),
    (t[(t.NumberFormats = 14)] = "NumberFormats"),
    (t[(t.CurrencyCode = 15)] = "CurrencyCode"),
    (t[(t.CurrencySymbol = 16)] = "CurrencySymbol"),
    (t[(t.CurrencyName = 17)] = "CurrencyName"),
    (t[(t.Currencies = 18)] = "Currencies"),
    (t[(t.Directionality = 19)] = "Directionality"),
    (t[(t.PluralCase = 20)] = "PluralCase"),
    (t[(t.ExtraData = 21)] = "ExtraData"),
    t
  );
})(Ie || {});
function jM(t) {
  return t.toLowerCase().replace(/_/g, "-");
}
var ol = "en-US",
  $M = "USD";
var BM = ol;
function UM(t) {
  typeof t == "string" && (BM = t.toLowerCase().replace(/_/g, "-"));
}
function U(t, e, r, n) {
  let i = Q(),
    o = Ue(),
    s = ot();
  return T0(o, i, i[be], s, t, e, n), U;
}
function HM(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[Io],
          l = i[o + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function T0(t, e, r, n, i, o, s) {
  let a = ll(n),
    c = t.firstCreatePass && Jy(t),
    u = e[nn],
    d = Zy(e),
    p = !0;
  if (n.type & 3 || s) {
    let S = Pt(n, e),
      x = s ? s(S) : S,
      T = d.length,
      j = s ? ($) => s(rn($[n.index])) : n.index,
      ne = null;
    if ((!s && a && (ne = HM(t, e, i, n.index)), ne !== null)) {
      let $ = ne.__ngLastListenerFn__ || ne;
      ($.__ngNextListenerFn__ = o), (ne.__ngLastListenerFn__ = o), (p = !1);
    } else {
      o = Qm(n, e, u, o, !1);
      let $ = r.listen(x, i, o);
      d.push(o, $), c && c.push(i, j, T, T + 1);
    }
  } else o = Qm(n, e, u, o, !1);
  let g = n.outputs,
    v;
  if (p && g !== null && (v = g[i])) {
    let S = v.length;
    if (S)
      for (let x = 0; x < S; x += 2) {
        let T = v[x],
          j = v[x + 1],
          ye = e[T][j].subscribe(o),
          _e = d.length;
        if ((d.push(o, ye), c)) {
          let Ee = typeof ye == "function" ? _e + 1 : -(_e + 1);
          c.push(i, n.index, _e, Ee);
        }
      }
  }
}
function Wm(t, e, r, n) {
  try {
    return vn(6, e, r), r(n) !== !1;
  } catch (i) {
    return Xy(t, i), !1;
  } finally {
    vn(7, e, r);
  }
}
function Qm(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? ur(t.index, e) : e;
    Lf(a);
    let l = Wm(e, r, n, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (l = Wm(e, r, c, s) && l), (c = c.__ngNextListenerFn__);
    return i && l === !1 && s.preventDefault(), l;
  };
}
function fe(t = 1) {
  return K_(t);
}
function Wf(t, e, r, n, i) {
  let o = Q(),
    s = S0(o, e, r, n);
  if (s !== an) {
    let a = Ue(),
      l = ul();
    Pf(a, l, o, t, s, o[be], i, !1);
  }
  return Wf;
}
function Pl(t, e, r, n) {
  WI(t, e, r, n);
}
function Rl(t) {
  let e = Q(),
    r = Ue(),
    n = bv();
  cf(n + 1);
  let i = qf(r, n);
  if (t.dirty && x_(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = ZI(e, n);
      t.reset(o, J_), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Fl() {
  return qI(Q(), bv());
}
function zM(t, e, r, n) {
  r >= t.data.length && ((t.data[r] = null), (t.blueprint[r] = null)),
    (e[r] = n);
}
function _t(t) {
  let e = B_();
  return of(e, Ze + t);
}
function m(t, e = "") {
  let r = Q(),
    n = Ue(),
    i = t + Ze,
    o = n.firstCreatePass ? Wo(n, i, 1, e, null) : n.data[i],
    s = x0(n, r, o, e, t);
  (r[i] = s), dl() && _l(n, r, s, o), Qr(o, !1);
}
var x0 = (t, e, r, n, i) => (dr(!0), xy(e[be], n));
function qM(t, e, r, n, i) {
  let o = e[Ln],
    s = !o || $o() || gl(o, i);
  return dr(s), s ? xy(e[be], n) : Tl(o, t, e, r);
}
function GM() {
  x0 = qM;
}
function Le(t) {
  return me("", t, ""), Le;
}
function me(t, e, r) {
  let n = Q(),
    i = S0(n, t, e, r);
  return i !== an && e0(n, Yr(), i), me;
}
function Qf(t, e, r, n, i) {
  let o = Q(),
    s = pM(o, t, e, r, n, i);
  return s !== an && e0(o, Yr(), s), Qf;
}
function ze(t, e, r) {
  h0(e) && (e = e());
  let n = Q(),
    i = cl();
  if (Un(n, i, e)) {
    let o = Ue(),
      s = ul();
    Pf(o, s, n, t, e, n[be], r, !1);
  }
  return ze;
}
function Xe(t, e) {
  let r = h0(t);
  return r && t.set(e), r;
}
function qe(t, e) {
  let r = Q(),
    n = Ue(),
    i = ot();
  return T0(n, r, r[be], i, t, e), qe;
}
function WM(t, e, r) {
  let n = Ue();
  if (n.firstCreatePass) {
    let i = ar(t);
    Xd(r, n.data, n.blueprint, i, !0), Xd(e, n.data, n.blueprint, i, !1);
  }
}
function Xd(t, e, r, n, i) {
  if (((t = lt(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) Xd(t[o], e, r, n, i);
  else {
    let o = Ue(),
      s = Q(),
      a = ot(),
      l = Pi(t) ? t : lt(t.provide),
      c = Xv(t),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (Pi(t) || !t.multi) {
      let g = new Hr(c, i, y),
        v = ed(l, e, i ? u : u + p, d);
      v === -1
        ? (yd(qa(a, s), o, l),
          Xu(o, t, e.length),
          e.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(g),
          s.push(g))
        : ((r[v] = g), (s[v] = g));
    } else {
      let g = ed(l, e, u + p, d),
        v = ed(l, e, u, u + p),
        S = g >= 0 && r[g],
        x = v >= 0 && r[v];
      if ((i && !x) || (!i && !S)) {
        yd(qa(a, s), o, l);
        let T = YM(i ? KM : QM, r.length, i, n, c);
        !i && x && (r[v].providerFactory = T),
          Xu(o, t, e.length, 0),
          e.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(T),
          s.push(T);
      } else {
        let T = A0(r[i ? v : g], c, !i && n);
        Xu(o, t, g > -1 ? g : v, T);
      }
      !i && n && x && r[v].componentProviders++;
    }
  }
}
function Xu(t, e, r, n) {
  let i = Pi(e),
    o = HE(e);
  if (i || o) {
    let l = (o ? lt(e.useClass) : e).prototype.ngOnDestroy;
    if (l) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let u = c.indexOf(r);
        u === -1 ? c.push(r, [n, l]) : c[u + 1].push(n, l);
      } else c.push(r, l);
    }
  }
}
function A0(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function ed(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function QM(t, e, r, n) {
  return ef(this.multi, []);
}
function KM(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = zr(r, r[z], this.providerFactory.index, n);
    (o = a.slice(0, s)), ef(i, o);
    for (let l = s; l < a.length; l++) o.push(a[l]);
  } else (o = []), ef(i, o);
  return o;
}
function ef(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function YM(t, e, r, n, i) {
  let o = new Hr(t, r, y);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    A0(o, i, n && !r),
    o
  );
}
function Me(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => WM(n, i ? i(t) : t, e);
  };
}
var ZM = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = Yv(!1, n.type),
          o =
            i.length > 0
              ? Nl([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = _({
    token: e,
    providedIn: "environment",
    factory: () => new e(w(ut)),
  });
  let t = e;
  return t;
})();
function N0(t) {
  Jr("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(ZM).getOrCreateStandaloneInjector(t));
}
function O0(t, e, r) {
  let n = Kr() + t,
    i = Q();
  return i[n] === an ? Qo(i, n, r ? e.call(r) : e()) : b0(i, n);
}
function ln(t, e, r, n) {
  return JM(Q(), Kr(), t, e, r, n);
}
function kl(t, e, r, n, i) {
  return R0(Q(), Kr(), t, e, r, n, i);
}
function P0(t, e, r, n, i, o, s) {
  return F0(Q(), Kr(), t, e, r, n, i, o, s);
}
function Kf(t, e, r, n, i, o, s, a) {
  let l = Kr() + t,
    c = Q(),
    u = C0(c, l, r, n, i, o);
  return Un(c, l + 4, s) || u
    ? Qo(c, l + 5, a ? e.call(a, r, n, i, o, s) : e(r, n, i, o, s))
    : b0(c, l + 5);
}
function Yf(t, e) {
  let r = t[e];
  return r === an ? void 0 : r;
}
function JM(t, e, r, n, i, o) {
  let s = e + r;
  return Un(t, s, i) ? Qo(t, s + 1, o ? n.call(o, i) : n(i)) : Yf(t, s + 1);
}
function R0(t, e, r, n, i, o, s) {
  let a = e + r;
  return rl(t, a, i, o)
    ? Qo(t, a + 2, s ? n.call(s, i, o) : n(i, o))
    : Yf(t, a + 2);
}
function F0(t, e, r, n, i, o, s, a, l) {
  let c = e + r;
  return C0(t, c, i, o, s, a)
    ? Qo(t, c + 4, l ? n.call(l, i, o, s, a) : n(i, o, s, a))
    : Yf(t, c + 4);
}
function Et(t, e) {
  let r = Ue(),
    n,
    i = t + Ze;
  r.firstCreatePass
    ? ((n = XM(e, r.pipeRegistry)),
      (r.data[i] = n),
      n.onDestroy && (r.destroyHooks ??= []).push(i, n.onDestroy))
    : (n = r.data[i]);
  let o = n.factory || (n.factory = Br(n.type, !0)),
    s,
    a = vt(y);
  try {
    let l = za(!1),
      c = o();
    return za(l), zM(r, Q(), i, c), c;
  } finally {
    vt(a);
  }
}
function XM(t, e) {
  if (e)
    for (let r = e.length - 1; r >= 0; r--) {
      let n = e[r];
      if (t === n.name) return n;
    }
}
function Ll(t, e, r, n) {
  let i = t + Ze,
    o = Q(),
    s = of(o, i);
  return k0(o, i) ? R0(o, Kr(), e, s.transform, r, n, s) : s.transform(r, n);
}
function Ht(t, e, r, n, i, o) {
  let s = t + Ze,
    a = Q(),
    l = of(a, s);
  return k0(a, s)
    ? F0(a, Kr(), e, l.transform, r, n, i, o, l)
    : l.transform(r, n, i, o);
}
function k0(t, e) {
  return t[z].data[e].pure;
}
function L0(t, e) {
  return Ml(t, e);
}
var Ma = null;
function eT(t) {
  (Ma !== null &&
    (t.defaultEncapsulation !== Ma.defaultEncapsulation ||
      t.preserveWhitespaces !== Ma.preserveWhitespaces)) ||
    (Ma = t);
}
var Vl = (() => {
  let e = class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var Zf = new A(""),
  Ko = new A(""),
  jl = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          Jf || (tT(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                ee.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(n) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              n();
          }, i)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: o });
      }
      whenStable(n, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(ee), w($l), w(Ko));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  $l = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, i) {
        this._applications.set(n, i);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, i = !0) {
        return Jf?.findTestabilityInTree(this, n, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function tT(t) {
  Jf = t;
}
var Jf;
function ei(t) {
  return !!t && typeof t.then == "function";
}
function V0(t) {
  return !!t && typeof t.subscribe == "function";
}
var Bl = new A(""),
  j0 = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = C(Bl, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (ei(s)) n.push(s);
          else if (V0(s)) {
            let a = new Promise((l, c) => {
              s.subscribe({ complete: l, error: c });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ui = new A("");
function nT() {
  Ng(() => {
    throw new b(600, !1);
  });
}
function rT(t) {
  return t.isBoundToModule;
}
function iT(t, e, r) {
  try {
    let n = r();
    return ei(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function $0(t, e) {
  return Array.isArray(e) ? e.reduce($0, t) : I(I({}, t), e);
}
var qn = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = C(gy)),
        (this.afterRenderEffectManager = C(Hf)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = C(Xr).hasPendingTasks.pipe(F((n) => !n))),
        (this._injector = C(ut));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof Ya;
      if (!this._injector.get(j0).done) {
        let g = !o && ov(n),
          v = !1;
        throw new b(405, v);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(Al).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let l = rT(a) ? void 0 : this._injector.get(cr),
        c = i || a.selector,
        u = a.create(Ut.NULL, [], c, l),
        d = u.location.nativeElement,
        p = u.injector.get(Zf, null);
      return (
        p?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            Ra(this.components, u),
            p?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      if (this._runningTick) throw new b(101, !1);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        this._runningTick = !1;
      }
    }
    detectChangesInAttachedViews() {
      let n = 0,
        i = this.afterRenderEffectManager;
      for (;;) {
        if (n === o0) throw new b(103, !1);
        let o = n === 0;
        for (let { _lView: s, notifyErrorHandler: a } of this._views)
          (!o && !td(s)) || this.detectChangesInView(s, a, o);
        if (
          (n++,
          i.executeInternalCallbacks(),
          !this._views.some(({ _lView: s }) => td(s)) &&
            (i.execute(), !this._views.some(({ _lView: s }) => td(s))))
        )
          break;
      }
    }
    detectChangesInView(n, i, o) {
      let s;
      o ? ((s = 0), (n[B] |= 1024)) : n[B] & 64 ? (s = 0) : (s = 1),
        s0(n, i, s);
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      Ra(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(Ui, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => Ra(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new b(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Ra(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
var Ta;
function Xf(t) {
  Ta ??= new WeakMap();
  let e = Ta.get(t);
  if (e) return e;
  let r = t.isStable
    .pipe(Ve((n) => n))
    .toPromise()
    .then(() => {});
  return Ta.set(t, r), t.onDestroy(() => Ta?.delete(t)), r;
}
function td(t) {
  return af(t);
}
var tf = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  Ul = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new nl(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = sv(n),
          s = Ty(o.declarations).reduce((a, l) => {
            let c = sr(l);
            return c && a.push(new Ri(c)), a;
          }, []);
        return new tf(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  oT = new A("");
function sT(t, e, r) {
  let n = new nl(r);
  return Promise.resolve(n);
}
function Km(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var aT = (() => {
  let e = class e {
    constructor() {
      (this.zone = C(ee)), (this.applicationRef = C(qn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function lT(t) {
  return [
    { provide: ee, useFactory: t },
    {
      provide: Ur,
      multi: !0,
      useFactory: () => {
        let e = C(aT, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: Ur,
      multi: !0,
      useFactory: () => {
        let e = C(dT);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: gy, useFactory: cT },
  ];
}
function cT() {
  let t = C(ee),
    e = C(Bt);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function uT(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var dT = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new Ne()),
        (this.initialized = !1),
        (this.zone = C(ee)),
        (this.pendingTasks = C(Xr));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              ee.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            ee.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function fT() {
  return (typeof $localize < "u" && $localize.locale) || ol;
}
var Yo = new A("", {
    providedIn: "root",
    factory: () => C(Yo, Y.Optional | Y.SkipSelf) || fT(),
  }),
  B0 = new A("", { providedIn: "root", factory: () => $M });
var U0 = new A(""),
  H0 = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, i) {
        let o = EI(
          i?.ngZone,
          uT({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = uM(
              n.moduleType,
              this.injector,
              lT(() => o)
            ),
            a = s.injector.get(Bt, null);
          return (
            o.runOutsideAngular(() => {
              let l = o.onError.subscribe({
                next: (c) => {
                  a.handleError(c);
                },
              });
              s.onDestroy(() => {
                Ra(this._modules, s), l.unsubscribe();
              });
            }),
            iT(a, o, () => {
              let l = s.injector.get(j0);
              return (
                l.runInitializers(),
                l.donePromise.then(() => {
                  let c = s.injector.get(Yo, ol);
                  return UM(c || ol), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, i = []) {
        let o = $0({}, i);
        return sT(this.injector, o, n).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(n) {
        let i = n.injector.get(qn);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(i);
        else throw new b(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new b(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let n = this._injector.get(U0, null);
        n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Ut));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Eo = null,
  z0 = new A("");
function hT(t) {
  if (Eo && !Eo.get(z0, !1)) throw new b(400, !1);
  nT(), (Eo = t);
  let e = t.get(H0);
  return mT(t), e;
}
function eh(t, e, r = []) {
  let n = `Platform: ${e}`,
    i = new A(n);
  return (o = []) => {
    let s = q0();
    if (!s || s.injector.get(z0, !1)) {
      let a = [...r, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : hT(pT(a, n));
    }
    return gT(i);
  };
}
function pT(t = [], e) {
  return Ut.create({
    name: e,
    providers: [
      { provide: vl, useValue: "platform" },
      { provide: U0, useValue: new Set([() => (Eo = null)]) },
      ...t,
    ],
  });
}
function gT(t) {
  let e = q0();
  if (!e) throw new b(401, !1);
  return e;
}
function q0() {
  return Eo?.get(H0) ?? null;
}
function mT(t) {
  t.get(hf, null)?.forEach((r) => r());
}
function G0() {
  return !1;
}
var W0 = eh(null, "core", []),
  Q0 = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(qn));
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({}));
    let t = e;
    return t;
  })();
var Ym = !1;
function vT() {
  Ym || ((Ym = !0), PE(), PM(), GM(), kM(), hM(), $I(), lI(), g1());
}
function yT(t, e) {
  return Xf(t);
}
function K0() {
  return Vi([
    {
      provide: ba,
      useFactory: () => {
        let t = !0;
        return (
          Co() && (t = !!C(Zr, { optional: !0 })?.get(zv, null)),
          t && Jr("NgHydration"),
          t
        );
      },
    },
    {
      provide: Ur,
      useValue: () => {
        Co() && C(ba) && (DT(), vT());
      },
      multi: !0,
    },
    { provide: vy, useFactory: () => Co() && C(ba) },
    {
      provide: Ui,
      useFactory: () => {
        if (Co() && C(ba)) {
          let t = C(qn),
            e = C(Ut);
          return () => {
            yT(t, e).then(() => {
              ee.assertInAngularZone(), eI(t);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function DT() {
  let t = Uo(),
    e;
  for (let r of t.body.childNodes)
    if (r.nodeType === Node.COMMENT_NODE && r.textContent?.trim() === NE) {
      e = r;
      break;
    }
  if (!e) throw new b(-507, !1);
}
function pr(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function Y0(t) {
  let e = sr(t);
  if (!e) return null;
  let r = new Ri(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var oD = null;
function Sn() {
  return oD;
}
function sD(t) {
  oD ??= t;
}
var Zl = class {};
var Ce = new A(""),
  fh = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => C(wT), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  aD = new A(""),
  wT = (() => {
    let e = class e extends fh {
      constructor() {
        super(),
          (this._doc = C(Ce)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return Sn().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = Sn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", n, !1),
          () => i.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let i = Sn().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", n, !1),
          () => i.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, o) {
        this._history.pushState(n, i, o);
      }
      replaceState(n, i, o) {
        this._history.replaceState(n, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function hh(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function Z0(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function Wn(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var In = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => C(ph), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  lD = new A(""),
  ph = (() => {
    let e = class e extends In {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            C(Ce).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return hh(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + Wn(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Wn(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Wn(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(fh), w(lD, 8));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  cD = (() => {
    let e = class e extends In {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash ?? "#";
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = hh(this._baseHref, n);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Wn(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Wn(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(fh), w(lD, 8));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  zi = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new ae()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = _T(Z0(J0(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = "") {
        return this.path() == this.normalize(n + Wn(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(CT(this._basePath, J0(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = "", o = null) {
        this._locationStrategy.pushState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Wn(i)), o);
      }
      replaceState(n, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Wn(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", i) {
        this._urlChangeListeners.forEach((o) => o(n, i));
      }
      subscribe(n, i, o) {
        return this._subject.subscribe({ next: n, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = Wn),
      (e.joinWithSlash = hh),
      (e.stripTrailingSlash = Z0),
      (e.ɵfac = function (i) {
        return new (i || e)(w(In));
      }),
      (e.ɵprov = _({ token: e, factory: () => bT(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function bT() {
  return new zi(w(In));
}
function CT(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function J0(t) {
  return t.replace(/\/index.html$/, "");
}
function _T(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
var uD = {
    ADP: [void 0, void 0, 0],
    AFN: [void 0, "\u060B", 0],
    ALL: [void 0, void 0, 0],
    AMD: [void 0, "\u058F", 2],
    AOA: [void 0, "Kz"],
    ARS: [void 0, "$"],
    AUD: ["A$", "$"],
    AZN: [void 0, "\u20BC"],
    BAM: [void 0, "KM"],
    BBD: [void 0, "$"],
    BDT: [void 0, "\u09F3"],
    BHD: [void 0, void 0, 3],
    BIF: [void 0, void 0, 0],
    BMD: [void 0, "$"],
    BND: [void 0, "$"],
    BOB: [void 0, "Bs"],
    BRL: ["R$"],
    BSD: [void 0, "$"],
    BWP: [void 0, "P"],
    BYN: [void 0, void 0, 2],
    BYR: [void 0, void 0, 0],
    BZD: [void 0, "$"],
    CAD: ["CA$", "$", 2],
    CHF: [void 0, void 0, 2],
    CLF: [void 0, void 0, 4],
    CLP: [void 0, "$", 0],
    CNY: ["CN\xA5", "\xA5"],
    COP: [void 0, "$", 2],
    CRC: [void 0, "\u20A1", 2],
    CUC: [void 0, "$"],
    CUP: [void 0, "$"],
    CZK: [void 0, "K\u010D", 2],
    DJF: [void 0, void 0, 0],
    DKK: [void 0, "kr", 2],
    DOP: [void 0, "$"],
    EGP: [void 0, "E\xA3"],
    ESP: [void 0, "\u20A7", 0],
    EUR: ["\u20AC"],
    FJD: [void 0, "$"],
    FKP: [void 0, "\xA3"],
    GBP: ["\xA3"],
    GEL: [void 0, "\u20BE"],
    GHS: [void 0, "GH\u20B5"],
    GIP: [void 0, "\xA3"],
    GNF: [void 0, "FG", 0],
    GTQ: [void 0, "Q"],
    GYD: [void 0, "$", 2],
    HKD: ["HK$", "$"],
    HNL: [void 0, "L"],
    HRK: [void 0, "kn"],
    HUF: [void 0, "Ft", 2],
    IDR: [void 0, "Rp", 2],
    ILS: ["\u20AA"],
    INR: ["\u20B9"],
    IQD: [void 0, void 0, 0],
    IRR: [void 0, void 0, 0],
    ISK: [void 0, "kr", 0],
    ITL: [void 0, void 0, 0],
    JMD: [void 0, "$"],
    JOD: [void 0, void 0, 3],
    JPY: ["\xA5", void 0, 0],
    KHR: [void 0, "\u17DB"],
    KMF: [void 0, "CF", 0],
    KPW: [void 0, "\u20A9", 0],
    KRW: ["\u20A9", void 0, 0],
    KWD: [void 0, void 0, 3],
    KYD: [void 0, "$"],
    KZT: [void 0, "\u20B8"],
    LAK: [void 0, "\u20AD", 0],
    LBP: [void 0, "L\xA3", 0],
    LKR: [void 0, "Rs"],
    LRD: [void 0, "$"],
    LTL: [void 0, "Lt"],
    LUF: [void 0, void 0, 0],
    LVL: [void 0, "Ls"],
    LYD: [void 0, void 0, 3],
    MGA: [void 0, "Ar", 0],
    MGF: [void 0, void 0, 0],
    MMK: [void 0, "K", 0],
    MNT: [void 0, "\u20AE", 2],
    MRO: [void 0, void 0, 0],
    MUR: [void 0, "Rs", 2],
    MXN: ["MX$", "$"],
    MYR: [void 0, "RM"],
    NAD: [void 0, "$"],
    NGN: [void 0, "\u20A6"],
    NIO: [void 0, "C$"],
    NOK: [void 0, "kr", 2],
    NPR: [void 0, "Rs"],
    NZD: ["NZ$", "$"],
    OMR: [void 0, void 0, 3],
    PHP: ["\u20B1"],
    PKR: [void 0, "Rs", 2],
    PLN: [void 0, "z\u0142"],
    PYG: [void 0, "\u20B2", 0],
    RON: [void 0, "lei"],
    RSD: [void 0, void 0, 0],
    RUB: [void 0, "\u20BD"],
    RWF: [void 0, "RF", 0],
    SBD: [void 0, "$"],
    SEK: [void 0, "kr", 2],
    SGD: [void 0, "$"],
    SHP: [void 0, "\xA3"],
    SLE: [void 0, void 0, 2],
    SLL: [void 0, void 0, 0],
    SOS: [void 0, void 0, 0],
    SRD: [void 0, "$"],
    SSP: [void 0, "\xA3"],
    STD: [void 0, void 0, 0],
    STN: [void 0, "Db"],
    SYP: [void 0, "\xA3", 0],
    THB: [void 0, "\u0E3F"],
    TMM: [void 0, void 0, 0],
    TND: [void 0, void 0, 3],
    TOP: [void 0, "T$"],
    TRL: [void 0, void 0, 0],
    TRY: [void 0, "\u20BA"],
    TTD: [void 0, "$"],
    TWD: ["NT$", "$", 2],
    TZS: [void 0, void 0, 2],
    UAH: [void 0, "\u20B4"],
    UGX: [void 0, void 0, 0],
    USD: ["$"],
    UYI: [void 0, void 0, 0],
    UYU: [void 0, "$"],
    UYW: [void 0, void 0, 4],
    UZS: [void 0, void 0, 2],
    VEF: [void 0, "Bs", 2],
    VND: ["\u20AB", void 0, 0],
    VUV: [void 0, void 0, 0],
    XAF: ["FCFA", void 0, 0],
    XCD: ["EC$", "$"],
    XOF: ["F\u202FCFA", void 0, 0],
    XPF: ["CFPF", void 0, 0],
    XXX: ["\xA4"],
    YER: [void 0, void 0, 0],
    ZAR: [void 0, "R"],
    ZMK: [void 0, void 0, 0],
    ZMW: [void 0, "ZK"],
    ZWD: [void 0, void 0, 0],
  },
  dD = (function (t) {
    return (
      (t[(t.Decimal = 0)] = "Decimal"),
      (t[(t.Percent = 1)] = "Percent"),
      (t[(t.Currency = 2)] = "Currency"),
      (t[(t.Scientific = 3)] = "Scientific"),
      t
    );
  })(dD || {});
var ht = (function (t) {
    return (
      (t[(t.Format = 0)] = "Format"), (t[(t.Standalone = 1)] = "Standalone"), t
    );
  })(ht || {}),
  he = (function (t) {
    return (
      (t[(t.Narrow = 0)] = "Narrow"),
      (t[(t.Abbreviated = 1)] = "Abbreviated"),
      (t[(t.Wide = 2)] = "Wide"),
      (t[(t.Short = 3)] = "Short"),
      t
    );
  })(he || {}),
  Ft = (function (t) {
    return (
      (t[(t.Short = 0)] = "Short"),
      (t[(t.Medium = 1)] = "Medium"),
      (t[(t.Long = 2)] = "Long"),
      (t[(t.Full = 3)] = "Full"),
      t
    );
  })(Ft || {}),
  St = (function (t) {
    return (
      (t[(t.Decimal = 0)] = "Decimal"),
      (t[(t.Group = 1)] = "Group"),
      (t[(t.List = 2)] = "List"),
      (t[(t.PercentSign = 3)] = "PercentSign"),
      (t[(t.PlusSign = 4)] = "PlusSign"),
      (t[(t.MinusSign = 5)] = "MinusSign"),
      (t[(t.Exponential = 6)] = "Exponential"),
      (t[(t.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
      (t[(t.PerMille = 8)] = "PerMille"),
      (t[(t.Infinity = 9)] = "Infinity"),
      (t[(t.NaN = 10)] = "NaN"),
      (t[(t.TimeSeparator = 11)] = "TimeSeparator"),
      (t[(t.CurrencyDecimal = 12)] = "CurrencyDecimal"),
      (t[(t.CurrencyGroup = 13)] = "CurrencyGroup"),
      t
    );
  })(St || {});
function ET(t) {
  return Ct(t)[Ie.LocaleId];
}
function ST(t, e, r) {
  let n = Ct(t),
    i = [n[Ie.DayPeriodsFormat], n[Ie.DayPeriodsStandalone]],
    o = zt(i, e);
  return zt(o, r);
}
function IT(t, e, r) {
  let n = Ct(t),
    i = [n[Ie.DaysFormat], n[Ie.DaysStandalone]],
    o = zt(i, e);
  return zt(o, r);
}
function MT(t, e, r) {
  let n = Ct(t),
    i = [n[Ie.MonthsFormat], n[Ie.MonthsStandalone]],
    o = zt(i, e);
  return zt(o, r);
}
function TT(t, e) {
  let n = Ct(t)[Ie.Eras];
  return zt(n, e);
}
function Hl(t, e) {
  let r = Ct(t);
  return zt(r[Ie.DateFormat], e);
}
function zl(t, e) {
  let r = Ct(t);
  return zt(r[Ie.TimeFormat], e);
}
function ql(t, e) {
  let n = Ct(t)[Ie.DateTimeFormat];
  return zt(n, e);
}
function Qn(t, e) {
  let r = Ct(t),
    n = r[Ie.NumberSymbols][e];
  if (typeof n > "u") {
    if (e === St.CurrencyDecimal) return r[Ie.NumberSymbols][St.Decimal];
    if (e === St.CurrencyGroup) return r[Ie.NumberSymbols][St.Group];
  }
  return n;
}
function xT(t, e) {
  return Ct(t)[Ie.NumberFormats][e];
}
function AT(t) {
  return Ct(t)[Ie.Currencies];
}
function fD(t) {
  if (!t[Ie.ExtraData])
    throw new Error(
      `Missing extra locale data for the locale "${
        t[Ie.LocaleId]
      }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
    );
}
function NT(t) {
  let e = Ct(t);
  return (
    fD(e),
    (e[Ie.ExtraData][2] || []).map((n) =>
      typeof n == "string" ? th(n) : [th(n[0]), th(n[1])]
    )
  );
}
function OT(t, e, r) {
  let n = Ct(t);
  fD(n);
  let i = [n[Ie.ExtraData][0], n[Ie.ExtraData][1]],
    o = zt(i, e) || [];
  return zt(o, r) || [];
}
function zt(t, e) {
  for (let r = e; r > -1; r--) if (typeof t[r] < "u") return t[r];
  throw new Error("Locale data API: locale data undefined");
}
function th(t) {
  let [e, r] = t.split(":");
  return { hours: +e, minutes: +r };
}
function PT(t, e, r = "en") {
  let n = AT(r)[t] || uD[t] || [],
    i = n[1];
  return e === "narrow" && typeof i == "string" ? i : n[0] || t;
}
var RT = 2;
function FT(t) {
  let e,
    r = uD[t];
  return r && (e = r[2]), typeof e == "number" ? e : RT;
}
var kT =
    /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
  Gl = {},
  LT =
    /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/,
  Kn = (function (t) {
    return (
      (t[(t.Short = 0)] = "Short"),
      (t[(t.ShortGMT = 1)] = "ShortGMT"),
      (t[(t.Long = 2)] = "Long"),
      (t[(t.Extended = 3)] = "Extended"),
      t
    );
  })(Kn || {}),
  oe = (function (t) {
    return (
      (t[(t.FullYear = 0)] = "FullYear"),
      (t[(t.Month = 1)] = "Month"),
      (t[(t.Date = 2)] = "Date"),
      (t[(t.Hours = 3)] = "Hours"),
      (t[(t.Minutes = 4)] = "Minutes"),
      (t[(t.Seconds = 5)] = "Seconds"),
      (t[(t.FractionalSeconds = 6)] = "FractionalSeconds"),
      (t[(t.Day = 7)] = "Day"),
      t
    );
  })(oe || {}),
  ie = (function (t) {
    return (
      (t[(t.DayPeriods = 0)] = "DayPeriods"),
      (t[(t.Days = 1)] = "Days"),
      (t[(t.Months = 2)] = "Months"),
      (t[(t.Eras = 3)] = "Eras"),
      t
    );
  })(ie || {});
function VT(t, e, r, n) {
  let i = WT(t);
  e = Gn(r, e) || e;
  let s = [],
    a;
  for (; e; )
    if (((a = LT.exec(e)), a)) {
      s = s.concat(a.slice(1));
      let u = s.pop();
      if (!u) break;
      e = u;
    } else {
      s.push(e);
      break;
    }
  let l = i.getTimezoneOffset();
  n && ((l = pD(n, l)), (i = GT(i, n, !0)));
  let c = "";
  return (
    s.forEach((u) => {
      let d = zT(u);
      c += d
        ? d(i, r, l)
        : u === "''"
        ? "'"
        : u.replace(/(^'|'$)/g, "").replace(/''/g, "'");
    }),
    c
  );
}
function Jl(t, e, r) {
  let n = new Date(0);
  return n.setFullYear(t, e, r), n.setHours(0, 0, 0), n;
}
function Gn(t, e) {
  let r = ET(t);
  if (((Gl[r] ??= {}), Gl[r][e])) return Gl[r][e];
  let n = "";
  switch (e) {
    case "shortDate":
      n = Hl(t, Ft.Short);
      break;
    case "mediumDate":
      n = Hl(t, Ft.Medium);
      break;
    case "longDate":
      n = Hl(t, Ft.Long);
      break;
    case "fullDate":
      n = Hl(t, Ft.Full);
      break;
    case "shortTime":
      n = zl(t, Ft.Short);
      break;
    case "mediumTime":
      n = zl(t, Ft.Medium);
      break;
    case "longTime":
      n = zl(t, Ft.Long);
      break;
    case "fullTime":
      n = zl(t, Ft.Full);
      break;
    case "short":
      let i = Gn(t, "shortTime"),
        o = Gn(t, "shortDate");
      n = Wl(ql(t, Ft.Short), [i, o]);
      break;
    case "medium":
      let s = Gn(t, "mediumTime"),
        a = Gn(t, "mediumDate");
      n = Wl(ql(t, Ft.Medium), [s, a]);
      break;
    case "long":
      let l = Gn(t, "longTime"),
        c = Gn(t, "longDate");
      n = Wl(ql(t, Ft.Long), [l, c]);
      break;
    case "full":
      let u = Gn(t, "fullTime"),
        d = Gn(t, "fullDate");
      n = Wl(ql(t, Ft.Full), [u, d]);
      break;
  }
  return n && (Gl[r][e] = n), n;
}
function Wl(t, e) {
  return (
    e &&
      (t = t.replace(/\{([^}]+)}/g, function (r, n) {
        return e != null && n in e ? e[n] : r;
      })),
    t
  );
}
function cn(t, e, r = "-", n, i) {
  let o = "";
  (t < 0 || (i && t <= 0)) && (i ? (t = -t + 1) : ((t = -t), (o = r)));
  let s = String(t);
  for (; s.length < e; ) s = "0" + s;
  return n && (s = s.slice(s.length - e)), o + s;
}
function jT(t, e) {
  return cn(t, 3).substring(0, e);
}
function $e(t, e, r = 0, n = !1, i = !1) {
  return function (o, s) {
    let a = $T(t, o);
    if (((r > 0 || a > -r) && (a += r), t === oe.Hours))
      a === 0 && r === -12 && (a = 12);
    else if (t === oe.FractionalSeconds) return jT(a, e);
    let l = Qn(s, St.MinusSign);
    return cn(a, e, l, n, i);
  };
}
function $T(t, e) {
  switch (t) {
    case oe.FullYear:
      return e.getFullYear();
    case oe.Month:
      return e.getMonth();
    case oe.Date:
      return e.getDate();
    case oe.Hours:
      return e.getHours();
    case oe.Minutes:
      return e.getMinutes();
    case oe.Seconds:
      return e.getSeconds();
    case oe.FractionalSeconds:
      return e.getMilliseconds();
    case oe.Day:
      return e.getDay();
    default:
      throw new Error(`Unknown DateType value "${t}".`);
  }
}
function ve(t, e, r = ht.Format, n = !1) {
  return function (i, o) {
    return BT(i, o, t, e, r, n);
  };
}
function BT(t, e, r, n, i, o) {
  switch (r) {
    case ie.Months:
      return MT(e, i, n)[t.getMonth()];
    case ie.Days:
      return IT(e, i, n)[t.getDay()];
    case ie.DayPeriods:
      let s = t.getHours(),
        a = t.getMinutes();
      if (o) {
        let c = NT(e),
          u = OT(e, i, n),
          d = c.findIndex((p) => {
            if (Array.isArray(p)) {
              let [g, v] = p,
                S = s >= g.hours && a >= g.minutes,
                x = s < v.hours || (s === v.hours && a < v.minutes);
              if (g.hours < v.hours) {
                if (S && x) return !0;
              } else if (S || x) return !0;
            } else if (p.hours === s && p.minutes === a) return !0;
            return !1;
          });
        if (d !== -1) return u[d];
      }
      return ST(e, i, n)[s < 12 ? 0 : 1];
    case ie.Eras:
      return TT(e, n)[t.getFullYear() <= 0 ? 0 : 1];
    default:
      let l = r;
      throw new Error(`unexpected translation type ${l}`);
  }
}
function Ql(t) {
  return function (e, r, n) {
    let i = -1 * n,
      o = Qn(r, St.MinusSign),
      s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
    switch (t) {
      case Kn.Short:
        return (i >= 0 ? "+" : "") + cn(s, 2, o) + cn(Math.abs(i % 60), 2, o);
      case Kn.ShortGMT:
        return "GMT" + (i >= 0 ? "+" : "") + cn(s, 1, o);
      case Kn.Long:
        return (
          "GMT" +
          (i >= 0 ? "+" : "") +
          cn(s, 2, o) +
          ":" +
          cn(Math.abs(i % 60), 2, o)
        );
      case Kn.Extended:
        return n === 0
          ? "Z"
          : (i >= 0 ? "+" : "") +
              cn(s, 2, o) +
              ":" +
              cn(Math.abs(i % 60), 2, o);
      default:
        throw new Error(`Unknown zone width "${t}"`);
    }
  };
}
var UT = 0,
  Yl = 4;
function HT(t) {
  let e = Jl(t, UT, 1).getDay();
  return Jl(t, 0, 1 + (e <= Yl ? Yl : Yl + 7) - e);
}
function hD(t) {
  let e = t.getDay(),
    r = e === 0 ? -3 : Yl - e;
  return Jl(t.getFullYear(), t.getMonth(), t.getDate() + r);
}
function nh(t, e = !1) {
  return function (r, n) {
    let i;
    if (e) {
      let o = new Date(r.getFullYear(), r.getMonth(), 1).getDay() - 1,
        s = r.getDate();
      i = 1 + Math.floor((s + o) / 7);
    } else {
      let o = hD(r),
        s = HT(o.getFullYear()),
        a = o.getTime() - s.getTime();
      i = 1 + Math.round(a / 6048e5);
    }
    return cn(i, t, Qn(n, St.MinusSign));
  };
}
function Kl(t, e = !1) {
  return function (r, n) {
    let o = hD(r).getFullYear();
    return cn(o, t, Qn(n, St.MinusSign), e);
  };
}
var rh = {};
function zT(t) {
  if (rh[t]) return rh[t];
  let e;
  switch (t) {
    case "G":
    case "GG":
    case "GGG":
      e = ve(ie.Eras, he.Abbreviated);
      break;
    case "GGGG":
      e = ve(ie.Eras, he.Wide);
      break;
    case "GGGGG":
      e = ve(ie.Eras, he.Narrow);
      break;
    case "y":
      e = $e(oe.FullYear, 1, 0, !1, !0);
      break;
    case "yy":
      e = $e(oe.FullYear, 2, 0, !0, !0);
      break;
    case "yyy":
      e = $e(oe.FullYear, 3, 0, !1, !0);
      break;
    case "yyyy":
      e = $e(oe.FullYear, 4, 0, !1, !0);
      break;
    case "Y":
      e = Kl(1);
      break;
    case "YY":
      e = Kl(2, !0);
      break;
    case "YYY":
      e = Kl(3);
      break;
    case "YYYY":
      e = Kl(4);
      break;
    case "M":
    case "L":
      e = $e(oe.Month, 1, 1);
      break;
    case "MM":
    case "LL":
      e = $e(oe.Month, 2, 1);
      break;
    case "MMM":
      e = ve(ie.Months, he.Abbreviated);
      break;
    case "MMMM":
      e = ve(ie.Months, he.Wide);
      break;
    case "MMMMM":
      e = ve(ie.Months, he.Narrow);
      break;
    case "LLL":
      e = ve(ie.Months, he.Abbreviated, ht.Standalone);
      break;
    case "LLLL":
      e = ve(ie.Months, he.Wide, ht.Standalone);
      break;
    case "LLLLL":
      e = ve(ie.Months, he.Narrow, ht.Standalone);
      break;
    case "w":
      e = nh(1);
      break;
    case "ww":
      e = nh(2);
      break;
    case "W":
      e = nh(1, !0);
      break;
    case "d":
      e = $e(oe.Date, 1);
      break;
    case "dd":
      e = $e(oe.Date, 2);
      break;
    case "c":
    case "cc":
      e = $e(oe.Day, 1);
      break;
    case "ccc":
      e = ve(ie.Days, he.Abbreviated, ht.Standalone);
      break;
    case "cccc":
      e = ve(ie.Days, he.Wide, ht.Standalone);
      break;
    case "ccccc":
      e = ve(ie.Days, he.Narrow, ht.Standalone);
      break;
    case "cccccc":
      e = ve(ie.Days, he.Short, ht.Standalone);
      break;
    case "E":
    case "EE":
    case "EEE":
      e = ve(ie.Days, he.Abbreviated);
      break;
    case "EEEE":
      e = ve(ie.Days, he.Wide);
      break;
    case "EEEEE":
      e = ve(ie.Days, he.Narrow);
      break;
    case "EEEEEE":
      e = ve(ie.Days, he.Short);
      break;
    case "a":
    case "aa":
    case "aaa":
      e = ve(ie.DayPeriods, he.Abbreviated);
      break;
    case "aaaa":
      e = ve(ie.DayPeriods, he.Wide);
      break;
    case "aaaaa":
      e = ve(ie.DayPeriods, he.Narrow);
      break;
    case "b":
    case "bb":
    case "bbb":
      e = ve(ie.DayPeriods, he.Abbreviated, ht.Standalone, !0);
      break;
    case "bbbb":
      e = ve(ie.DayPeriods, he.Wide, ht.Standalone, !0);
      break;
    case "bbbbb":
      e = ve(ie.DayPeriods, he.Narrow, ht.Standalone, !0);
      break;
    case "B":
    case "BB":
    case "BBB":
      e = ve(ie.DayPeriods, he.Abbreviated, ht.Format, !0);
      break;
    case "BBBB":
      e = ve(ie.DayPeriods, he.Wide, ht.Format, !0);
      break;
    case "BBBBB":
      e = ve(ie.DayPeriods, he.Narrow, ht.Format, !0);
      break;
    case "h":
      e = $e(oe.Hours, 1, -12);
      break;
    case "hh":
      e = $e(oe.Hours, 2, -12);
      break;
    case "H":
      e = $e(oe.Hours, 1);
      break;
    case "HH":
      e = $e(oe.Hours, 2);
      break;
    case "m":
      e = $e(oe.Minutes, 1);
      break;
    case "mm":
      e = $e(oe.Minutes, 2);
      break;
    case "s":
      e = $e(oe.Seconds, 1);
      break;
    case "ss":
      e = $e(oe.Seconds, 2);
      break;
    case "S":
      e = $e(oe.FractionalSeconds, 1);
      break;
    case "SS":
      e = $e(oe.FractionalSeconds, 2);
      break;
    case "SSS":
      e = $e(oe.FractionalSeconds, 3);
      break;
    case "Z":
    case "ZZ":
    case "ZZZ":
      e = Ql(Kn.Short);
      break;
    case "ZZZZZ":
      e = Ql(Kn.Extended);
      break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
      e = Ql(Kn.ShortGMT);
      break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
      e = Ql(Kn.Long);
      break;
    default:
      return null;
  }
  return (rh[t] = e), e;
}
function pD(t, e) {
  t = t.replace(/:/g, "");
  let r = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
  return isNaN(r) ? e : r;
}
function qT(t, e) {
  return (t = new Date(t.getTime())), t.setMinutes(t.getMinutes() + e), t;
}
function GT(t, e, r) {
  let n = r ? -1 : 1,
    i = t.getTimezoneOffset(),
    o = pD(e, i);
  return qT(t, n * (o - i));
}
function WT(t) {
  if (X0(t)) return t;
  if (typeof t == "number" && !isNaN(t)) return new Date(t);
  if (typeof t == "string") {
    if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
      let [i, o = 1, s = 1] = t.split("-").map((a) => +a);
      return Jl(i, o - 1, s);
    }
    let r = parseFloat(t);
    if (!isNaN(t - r)) return new Date(r);
    let n;
    if ((n = t.match(kT))) return QT(n);
  }
  let e = new Date(t);
  if (!X0(e)) throw new Error(`Unable to convert "${t}" into a date`);
  return e;
}
function QT(t) {
  let e = new Date(0),
    r = 0,
    n = 0,
    i = t[8] ? e.setUTCFullYear : e.setFullYear,
    o = t[8] ? e.setUTCHours : e.setHours;
  t[9] && ((r = Number(t[9] + t[10])), (n = Number(t[9] + t[11]))),
    i.call(e, Number(t[1]), Number(t[2]) - 1, Number(t[3]));
  let s = Number(t[4] || 0) - r,
    a = Number(t[5] || 0) - n,
    l = Number(t[6] || 0),
    c = Math.floor(parseFloat("0." + (t[7] || 0)) * 1e3);
  return o.call(e, s, a, l, c), e;
}
function X0(t) {
  return t instanceof Date && !isNaN(t.valueOf());
}
var KT = /^(\d+)?\.((\d+)(-(\d+))?)?$/,
  eD = 22,
  Xl = ".",
  Zo = "0",
  YT = ";",
  ZT = ",",
  ih = "#",
  tD = "\xA4";
function JT(t, e, r, n, i, o, s = !1) {
  let a = "",
    l = !1;
  if (!isFinite(t)) a = Qn(r, St.Infinity);
  else {
    let c = nx(t);
    s && (c = tx(c));
    let u = e.minInt,
      d = e.minFrac,
      p = e.maxFrac;
    if (o) {
      let j = o.match(KT);
      if (j === null) throw new Error(`${o} is not a valid digit info`);
      let ne = j[1],
        $ = j[3],
        ye = j[5];
      ne != null && (u = oh(ne)),
        $ != null && (d = oh($)),
        ye != null ? (p = oh(ye)) : $ != null && d > p && (p = d);
    }
    rx(c, d, p);
    let g = c.digits,
      v = c.integerLen,
      S = c.exponent,
      x = [];
    for (l = g.every((j) => !j); v < u; v++) g.unshift(0);
    for (; v < 0; v++) g.unshift(0);
    v > 0 ? (x = g.splice(v, g.length)) : ((x = g), (g = [0]));
    let T = [];
    for (
      g.length >= e.lgSize && T.unshift(g.splice(-e.lgSize, g.length).join(""));
      g.length > e.gSize;

    )
      T.unshift(g.splice(-e.gSize, g.length).join(""));
    g.length && T.unshift(g.join("")),
      (a = T.join(Qn(r, n))),
      x.length && (a += Qn(r, i) + x.join("")),
      S && (a += Qn(r, St.Exponential) + "+" + S);
  }
  return (
    t < 0 && !l ? (a = e.negPre + a + e.negSuf) : (a = e.posPre + a + e.posSuf),
    a
  );
}
function XT(t, e, r, n, i) {
  let o = xT(e, dD.Currency),
    s = ex(o, Qn(e, St.MinusSign));
  return (
    (s.minFrac = FT(n)),
    (s.maxFrac = s.minFrac),
    JT(t, s, e, St.CurrencyGroup, St.CurrencyDecimal, i)
      .replace(tD, r)
      .replace(tD, "")
      .trim()
  );
}
function ex(t, e = "-") {
  let r = {
      minInt: 1,
      minFrac: 0,
      maxFrac: 0,
      posPre: "",
      posSuf: "",
      negPre: "",
      negSuf: "",
      gSize: 0,
      lgSize: 0,
    },
    n = t.split(YT),
    i = n[0],
    o = n[1],
    s =
      i.indexOf(Xl) !== -1
        ? i.split(Xl)
        : [
            i.substring(0, i.lastIndexOf(Zo) + 1),
            i.substring(i.lastIndexOf(Zo) + 1),
          ],
    a = s[0],
    l = s[1] || "";
  r.posPre = a.substring(0, a.indexOf(ih));
  for (let u = 0; u < l.length; u++) {
    let d = l.charAt(u);
    d === Zo
      ? (r.minFrac = r.maxFrac = u + 1)
      : d === ih
      ? (r.maxFrac = u + 1)
      : (r.posSuf += d);
  }
  let c = a.split(ZT);
  if (
    ((r.gSize = c[1] ? c[1].length : 0),
    (r.lgSize = c[2] || c[1] ? (c[2] || c[1]).length : 0),
    o)
  ) {
    let u = i.length - r.posPre.length - r.posSuf.length,
      d = o.indexOf(ih);
    (r.negPre = o.substring(0, d).replace(/'/g, "")),
      (r.negSuf = o.slice(d + u).replace(/'/g, ""));
  } else (r.negPre = e + r.posPre), (r.negSuf = r.posSuf);
  return r;
}
function tx(t) {
  if (t.digits[0] === 0) return t;
  let e = t.digits.length - t.integerLen;
  return (
    t.exponent
      ? (t.exponent += 2)
      : (e === 0 ? t.digits.push(0, 0) : e === 1 && t.digits.push(0),
        (t.integerLen += 2)),
    t
  );
}
function nx(t) {
  let e = Math.abs(t) + "",
    r = 0,
    n,
    i,
    o,
    s,
    a;
  for (
    (i = e.indexOf(Xl)) > -1 && (e = e.replace(Xl, "")),
      (o = e.search(/e/i)) > 0
        ? (i < 0 && (i = o), (i += +e.slice(o + 1)), (e = e.substring(0, o)))
        : i < 0 && (i = e.length),
      o = 0;
    e.charAt(o) === Zo;
    o++
  );
  if (o === (a = e.length)) (n = [0]), (i = 1);
  else {
    for (a--; e.charAt(a) === Zo; ) a--;
    for (i -= o, n = [], s = 0; o <= a; o++, s++) n[s] = Number(e.charAt(o));
  }
  return (
    i > eD && ((n = n.splice(0, eD - 1)), (r = i - 1), (i = 1)),
    { digits: n, exponent: r, integerLen: i }
  );
}
function rx(t, e, r) {
  if (e > r)
    throw new Error(
      `The minimum number of digits after fraction (${e}) is higher than the maximum (${r}).`
    );
  let n = t.digits,
    i = n.length - t.integerLen,
    o = Math.min(Math.max(e, i), r),
    s = o + t.integerLen,
    a = n[s];
  if (s > 0) {
    n.splice(Math.max(t.integerLen, s));
    for (let d = s; d < n.length; d++) n[d] = 0;
  } else {
    (i = Math.max(0, i)),
      (t.integerLen = 1),
      (n.length = Math.max(1, (s = o + 1))),
      (n[0] = 0);
    for (let d = 1; d < s; d++) n[d] = 0;
  }
  if (a >= 5)
    if (s - 1 < 0) {
      for (let d = 0; d > s; d--) n.unshift(0), t.integerLen++;
      n.unshift(1), t.integerLen++;
    } else n[s - 1]++;
  for (; i < Math.max(0, o); i++) n.push(0);
  let l = o !== 0,
    c = e + t.integerLen,
    u = n.reduceRight(function (d, p, g, v) {
      return (
        (p = p + d),
        (v[g] = p < 10 ? p : p - 10),
        l && (v[g] === 0 && g >= c ? v.pop() : (l = !1)),
        p >= 10 ? 1 : 0
      );
    }, 0);
  u && (n.unshift(u), t.integerLen++);
}
function oh(t) {
  let e = parseInt(t);
  if (isNaN(e)) throw new Error("Invalid integer literal when parsing " + t);
  return e;
}
function ec(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var sh = /\s+/,
  nD = [],
  Jo = (() => {
    let e = class e {
      constructor(n, i) {
        (this._ngEl = n),
          (this._renderer = i),
          (this.initialClasses = nD),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(sh) : nD;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(sh) : n;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let i of n) this._updateState(i, !0);
        else if (n != null)
          for (let i of Object.keys(n)) this._updateState(i, !!n[i]);
        this._applyStateDiff();
      }
      _updateState(n, i) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let i = n[0],
            o = n[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(n, i) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(sh).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(He), y(bt));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [Re.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var ah = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Ge = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, o) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new ah(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let l = i.get(s);
            i.move(l, a), rD(l, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let l = i.get(o).context;
          (l.index = o), (l.count = s), (l.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          rD(s, o);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(zn), y(Bn), y(jf));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function rD(t, e) {
  t.context.$implicit = e.item;
}
var Te = (() => {
    let e = class e {
      constructor(n, i) {
        (this._viewContainer = n),
          (this._context = new lh()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(n) {
        (this._context.$implicit = this._context.ngIf = n), this._updateView();
      }
      set ngIfThen(n) {
        iD("ngIfThen", n),
          (this._thenTemplateRef = n),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(n) {
        iD("ngIfElse", n),
          (this._elseTemplateRef = n),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(zn), y(Bn));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  lh = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function iD(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${ct(e)}'.`);
}
var gD = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngEl = n),
          (this._differs = i),
          (this._renderer = o),
          (this._ngStyle = null),
          (this._differ = null);
      }
      set ngStyle(n) {
        (this._ngStyle = n),
          !this._differ && n && (this._differ = this._differs.find(n).create());
      }
      ngDoCheck() {
        if (this._differ) {
          let n = this._differ.diff(this._ngStyle);
          n && this._applyChanges(n);
        }
      }
      _setStyle(n, i) {
        let [o, s] = n.split("."),
          a = o.indexOf("-") === -1 ? void 0 : wn.DashCase;
        i != null
          ? this._renderer.setStyle(
              this._ngEl.nativeElement,
              o,
              s ? `${i}${s}` : i,
              a
            )
          : this._renderer.removeStyle(this._ngEl.nativeElement, o, a);
      }
      _applyChanges(n) {
        n.forEachRemovedItem((i) => this._setStyle(i.key, null)),
          n.forEachAddedItem((i) => this._setStyle(i.key, i.currentValue)),
          n.forEachChangedItem((i) => this._setStyle(i.key, i.currentValue));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(He), y($f), y(bt));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "ngStyle", ""]],
        inputs: { ngStyle: "ngStyle" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  mD = (() => {
    let e = class e {
      constructor(n) {
        (this._viewContainerRef = n),
          (this._viewRef = null),
          (this.ngTemplateOutletContext = null),
          (this.ngTemplateOutlet = null),
          (this.ngTemplateOutletInjector = null);
      }
      ngOnChanges(n) {
        if (this._shouldRecreateView(n)) {
          let i = this._viewContainerRef;
          if (
            (this._viewRef && i.remove(i.indexOf(this._viewRef)),
            !this.ngTemplateOutlet)
          ) {
            this._viewRef = null;
            return;
          }
          let o = this._createContextForwardProxy();
          this._viewRef = i.createEmbeddedView(this.ngTemplateOutlet, o, {
            injector: this.ngTemplateOutletInjector ?? void 0,
          });
        }
      }
      _shouldRecreateView(n) {
        return !!n.ngTemplateOutlet || !!n.ngTemplateOutletInjector;
      }
      _createContextForwardProxy() {
        return new Proxy(
          {},
          {
            set: (n, i, o) =>
              this.ngTemplateOutletContext
                ? Reflect.set(this.ngTemplateOutletContext, i, o)
                : !1,
            get: (n, i, o) => {
              if (this.ngTemplateOutletContext)
                return Reflect.get(this.ngTemplateOutletContext, i, o);
            },
          }
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(zn));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "ngTemplateOutlet", ""]],
        inputs: {
          ngTemplateOutletContext: "ngTemplateOutletContext",
          ngTemplateOutlet: "ngTemplateOutlet",
          ngTemplateOutletInjector: "ngTemplateOutletInjector",
        },
        standalone: !0,
        features: [Dt],
      }));
    let t = e;
    return t;
  })();
function vD(t, e) {
  return new b(2100, !1);
}
var ix = "mediumDate",
  ox = new A(""),
  sx = new A(""),
  yD = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.locale = n),
          (this.defaultTimezone = i),
          (this.defaultOptions = o);
      }
      transform(n, i, o, s) {
        if (n == null || n === "" || n !== n) return null;
        try {
          let a = i ?? this.defaultOptions?.dateFormat ?? ix,
            l =
              o ??
              this.defaultOptions?.timezone ??
              this.defaultTimezone ??
              void 0;
          return VT(n, a, s || this.locale, l);
        } catch (a) {
          throw vD(e, a.message);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Yo, 16), y(ox, 24), y(sx, 24));
    }),
      (e.ɵpipe = Lo({ name: "date", type: e, pure: !0, standalone: !0 }));
    let t = e;
    return t;
  })();
var Mn = (() => {
  let e = class e {
    constructor(n, i = "USD") {
      (this._locale = n), (this._defaultCurrencyCode = i);
    }
    transform(n, i = this._defaultCurrencyCode, o = "symbol", s, a) {
      if (!ax(n)) return null;
      (a ||= this._locale),
        typeof o == "boolean" && (o = o ? "symbol" : "code");
      let l = i || this._defaultCurrencyCode;
      o !== "code" &&
        (o === "symbol" || o === "symbol-narrow"
          ? (l = PT(l, o === "symbol" ? "wide" : "narrow", a))
          : (l = o));
      try {
        let c = lx(n);
        return XT(c, a, l, i, s);
      } catch (c) {
        throw vD(e, c.message);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Yo, 16), y(B0, 16));
  }),
    (e.ɵpipe = Lo({ name: "currency", type: e, pure: !0, standalone: !0 }));
  let t = e;
  return t;
})();
function ax(t) {
  return !(t == null || t === "" || t !== t);
}
function lx(t) {
  if (typeof t == "string" && !isNaN(Number(t) - parseFloat(t)))
    return Number(t);
  if (typeof t != "number") throw new Error(`${t} is not a number`);
  return t;
}
var tc = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({}));
    let t = e;
    return t;
  })(),
  gh = "browser",
  cx = "server";
function Xo(t) {
  return t === gh;
}
function mh(t) {
  return t === cx;
}
var DD = (() => {
    let e = class e {};
    e.ɵprov = _({
      token: e,
      providedIn: "root",
      factory: () => (Xo(C(ft)) ? new ch(C(Ce), window) : new uh()),
    });
    let t = e;
    return t;
  })(),
  ch = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = ux(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(n - o[0], i - o[1]);
    }
  };
function ux(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var uh = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  Hi = class {};
var ts = class {},
  ic = class {},
  qt = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
            ? ((this.headers = new Map()),
              e.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(e).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let r = this.headers.get(e.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, r) {
      return this.clone({ name: e, value: r, op: "a" });
    }
    set(e, r) {
      return this.clone({ name: e, value: r, op: "s" });
    }
    delete(e, r) {
      return this.clone({ name: e, value: r, op: "d" });
    }
    maybeSetNormalizedName(e, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((r) => {
          this.headers.set(r, e.headers.get(r)),
            this.normalizedNames.set(r, e.normalizedNames.get(r));
        });
    }
    clone(e) {
      let r = new t();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        r
      );
    }
    applyUpdate(e) {
      let r = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let n = e.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(e.name, r);
          let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case "d":
          let o = e.value;
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(e, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = e.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          e(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var yh = class {
  encodeKey(e) {
    return wD(e);
  }
  encodeValue(e) {
    return wD(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function fx(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, o)), e.decodeValue(i.slice(o + 1))],
            l = r.get(s) || [];
          l.push(a), r.set(s, l);
        }),
    r
  );
}
var hx = /%(\d[a-f0-9])/gi,
  px = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function wD(t) {
  return encodeURIComponent(t).replace(hx, (e, r) => px[r] ?? e);
}
function nc(t) {
  return `${t}`;
}
var gr = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new yh()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = fx(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(nc) : [nc(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: "a" });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let r = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              r.push(nc(e.value)), this.map.set(e.param, r);
              break;
            case "d":
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(nc(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Dh = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function gx(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function bD(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function CD(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function _D(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function mx(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var es = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let o;
      if (
        (gx(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new qt()),
        (this.context ??= new Dh()),
        !this.params)
      )
        (this.params = new gr()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            l = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + l + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : bD(this.body) ||
          CD(this.body) ||
          _D(this.body) ||
          mx(this.body) ||
          typeof this.body == "string"
        ? this.body
        : this.body instanceof gr
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || _D(this.body)
        ? null
        : CD(this.body)
        ? this.body.type || null
        : bD(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof gr
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        o = e.body !== void 0 ? e.body : this.body,
        s =
          e.withCredentials !== void 0
            ? e.withCredentials
            : this.withCredentials,
        a =
          e.reportProgress !== void 0 ? e.reportProgress : this.reportProgress,
        l = e.headers || this.headers,
        c = e.params || this.params,
        u = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (l = Object.keys(e.setHeaders).reduce(
            (d, p) => d.set(p, e.setHeaders[p]),
            l
          )),
        e.setParams &&
          (c = Object.keys(e.setParams).reduce(
            (d, p) => d.set(p, e.setParams[p]),
            c
          )),
        new t(r, n, o, {
          params: c,
          headers: l,
          context: u,
          reportProgress: a,
          responseType: i,
          withCredentials: s,
        })
      );
    }
  },
  qi = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(qi || {}),
  ns = class {
    constructor(e, r = sc.Ok, n = "OK") {
      (this.headers = e.headers || new qt()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  wh = class t extends ns {
    constructor(e = {}) {
      super(e), (this.type = qi.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Gi = class t extends ns {
    constructor(e = {}) {
      super(e),
        (this.type = qi.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  oc = class extends ns {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              e.url || "(unknown url)"
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  sc = (function (t) {
    return (
      (t[(t.Continue = 100)] = "Continue"),
      (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (t[(t.Processing = 102)] = "Processing"),
      (t[(t.EarlyHints = 103)] = "EarlyHints"),
      (t[(t.Ok = 200)] = "Ok"),
      (t[(t.Created = 201)] = "Created"),
      (t[(t.Accepted = 202)] = "Accepted"),
      (t[(t.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (t[(t.NoContent = 204)] = "NoContent"),
      (t[(t.ResetContent = 205)] = "ResetContent"),
      (t[(t.PartialContent = 206)] = "PartialContent"),
      (t[(t.MultiStatus = 207)] = "MultiStatus"),
      (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
      (t[(t.ImUsed = 226)] = "ImUsed"),
      (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
      (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
      (t[(t.Found = 302)] = "Found"),
      (t[(t.SeeOther = 303)] = "SeeOther"),
      (t[(t.NotModified = 304)] = "NotModified"),
      (t[(t.UseProxy = 305)] = "UseProxy"),
      (t[(t.Unused = 306)] = "Unused"),
      (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
      (t[(t.BadRequest = 400)] = "BadRequest"),
      (t[(t.Unauthorized = 401)] = "Unauthorized"),
      (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
      (t[(t.Forbidden = 403)] = "Forbidden"),
      (t[(t.NotFound = 404)] = "NotFound"),
      (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
      (t[(t.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
      (t[(t.Conflict = 409)] = "Conflict"),
      (t[(t.Gone = 410)] = "Gone"),
      (t[(t.LengthRequired = 411)] = "LengthRequired"),
      (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
      (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (t[(t.UriTooLong = 414)] = "UriTooLong"),
      (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
      (t[(t.ImATeapot = 418)] = "ImATeapot"),
      (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (t[(t.Locked = 423)] = "Locked"),
      (t[(t.FailedDependency = 424)] = "FailedDependency"),
      (t[(t.TooEarly = 425)] = "TooEarly"),
      (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
      (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
      (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (t[(t.InternalServerError = 500)] = "InternalServerError"),
      (t[(t.NotImplemented = 501)] = "NotImplemented"),
      (t[(t.BadGateway = 502)] = "BadGateway"),
      (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
      (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
      (t[(t.LoopDetected = 508)] = "LoopDetected"),
      (t[(t.NotExtended = 510)] = "NotExtended"),
      (t[(t.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      t
    );
  })(sc || {});
function vh(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var pt = (() => {
  let e = class e {
    constructor(n) {
      this.handler = n;
    }
    request(n, i, o = {}) {
      let s;
      if (n instanceof es) s = n;
      else {
        let c;
        o.headers instanceof qt ? (c = o.headers) : (c = new qt(o.headers));
        let u;
        o.params &&
          (o.params instanceof gr
            ? (u = o.params)
            : (u = new gr({ fromObject: o.params }))),
          (s = new es(n, i, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: u,
            reportProgress: o.reportProgress,
            responseType: o.responseType || "json",
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }));
      }
      let a = P(s).pipe(Fn((c) => this.handler.handle(c)));
      if (n instanceof es || o.observe === "events") return a;
      let l = a.pipe(Oe((c) => c instanceof Gi));
      switch (o.observe || "body") {
        case "body":
          switch (s.responseType) {
            case "arraybuffer":
              return l.pipe(
                F((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return c.body;
                })
              );
            case "blob":
              return l.pipe(
                F((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return c.body;
                })
              );
            case "text":
              return l.pipe(
                F((c) => {
                  if (c.body !== null && typeof c.body != "string")
                    throw new Error("Response is not a string.");
                  return c.body;
                })
              );
            case "json":
            default:
              return l.pipe(F((c) => c.body));
          }
        case "response":
          return l;
        default:
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
      }
    }
    delete(n, i = {}) {
      return this.request("DELETE", n, i);
    }
    get(n, i = {}) {
      return this.request("GET", n, i);
    }
    head(n, i = {}) {
      return this.request("HEAD", n, i);
    }
    jsonp(n, i) {
      return this.request("JSONP", n, {
        params: new gr().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(n, i = {}) {
      return this.request("OPTIONS", n, i);
    }
    patch(n, i, o = {}) {
      return this.request("PATCH", n, vh(o, i));
    }
    post(n, i, o = {}) {
      return this.request("POST", n, vh(o, i));
    }
    put(n, i, o = {}) {
      return this.request("PUT", n, vh(o, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(ts));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function PD(t, e) {
  return e(t);
}
function vx(t, e) {
  return (r, n) => e.intercept(r, { handle: (i) => t(i, n) });
}
function yx(t, e, r) {
  return (n, i) => _n(r, () => e(n, (o) => t(o, i)));
}
var Dx = new A(""),
  bh = new A(""),
  RD = new A(""),
  wx = new A("");
function bx() {
  let t = null;
  return (e, r) => {
    t === null && (t = (C(Dx, { optional: !0 }) ?? []).reduceRight(vx, PD));
    let n = C(Xr),
      i = n.add();
    return t(e, r).pipe(rr(() => n.remove(i)));
  };
}
var ED = (() => {
  let e = class e extends ts {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = C(Xr));
      let o = C(wx, { optional: !0 });
      this.backend = o ?? n;
    }
    handle(n) {
      if (this.chain === null) {
        let o = Array.from(
          new Set([...this.injector.get(bh), ...this.injector.get(RD, [])])
        );
        this.chain = o.reduceRight((s, a) => yx(s, a, this.injector), PD);
      }
      let i = this.pendingTasks.add();
      return this.chain(n, (o) => this.backend.handle(o)).pipe(
        rr(() => this.pendingTasks.remove(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(ic), w(ut));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var Cx = /^\)\]\}',?\n/;
function _x(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader("X-Request-URL")
    : null;
}
var SD = (() => {
    let e = class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new b(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? se(i.ɵloadImpl()) : P(null)).pipe(
          je(
            () =>
              new Z((s) => {
                let a = i.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((x, T) =>
                    a.setRequestHeader(x, T.join(","))
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let x = n.detectContentTypeHeader();
                  x !== null && a.setRequestHeader("Content-Type", x);
                }
                if (n.responseType) {
                  let x = n.responseType.toLowerCase();
                  a.responseType = x !== "json" ? x : "text";
                }
                let l = n.serializeBody(),
                  c = null,
                  u = () => {
                    if (c !== null) return c;
                    let x = a.statusText || "OK",
                      T = new qt(a.getAllResponseHeaders()),
                      j = _x(a) || n.url;
                    return (
                      (c = new wh({
                        headers: T,
                        status: a.status,
                        statusText: x,
                        url: j,
                      })),
                      c
                    );
                  },
                  d = () => {
                    let { headers: x, status: T, statusText: j, url: ne } = u(),
                      $ = null;
                    T !== sc.NoContent &&
                      ($ =
                        typeof a.response > "u" ? a.responseText : a.response),
                      T === 0 && (T = $ ? sc.Ok : 0);
                    let ye = T >= 200 && T < 300;
                    if (n.responseType === "json" && typeof $ == "string") {
                      let _e = $;
                      $ = $.replace(Cx, "");
                      try {
                        $ = $ !== "" ? JSON.parse($) : null;
                      } catch (Ee) {
                        ($ = _e),
                          ye && ((ye = !1), ($ = { error: Ee, text: $ }));
                      }
                    }
                    ye
                      ? (s.next(
                          new Gi({
                            body: $,
                            headers: x,
                            status: T,
                            statusText: j,
                            url: ne || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new oc({
                            error: $,
                            headers: x,
                            status: T,
                            statusText: j,
                            url: ne || void 0,
                          })
                        );
                  },
                  p = (x) => {
                    let { url: T } = u(),
                      j = new oc({
                        error: x,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: T || void 0,
                      });
                    s.error(j);
                  },
                  g = !1,
                  v = (x) => {
                    g || (s.next(u()), (g = !0));
                    let T = { type: qi.DownloadProgress, loaded: x.loaded };
                    x.lengthComputable && (T.total = x.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (T.partialText = a.responseText),
                      s.next(T);
                  },
                  S = (x) => {
                    let T = { type: qi.UploadProgress, loaded: x.loaded };
                    x.lengthComputable && (T.total = x.total), s.next(T);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", p),
                  a.addEventListener("timeout", p),
                  a.addEventListener("abort", p),
                  n.reportProgress &&
                    (a.addEventListener("progress", v),
                    l !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", S)),
                  a.send(l),
                  s.next({ type: qi.Sent }),
                  () => {
                    a.removeEventListener("error", p),
                      a.removeEventListener("abort", p),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", p),
                      n.reportProgress &&
                        (a.removeEventListener("progress", v),
                        l !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", S)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Hi));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  FD = new A(""),
  Ex = "XSRF-TOKEN",
  Sx = new A("", { providedIn: "root", factory: () => Ex }),
  Ix = "X-XSRF-TOKEN",
  Mx = new A("", { providedIn: "root", factory: () => Ix }),
  ac = class {},
  Tx = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = ec(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Ce), w(ft), w(Sx));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function xx(t, e) {
  let r = t.url.toLowerCase();
  if (
    !C(FD) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return e(t);
  let n = C(ac).getToken(),
    i = C(Mx);
  return (
    n != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, n) })),
    e(t)
  );
}
var kD = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = "Interceptors"),
    (t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (t[(t.JsonpSupport = 4)] = "JsonpSupport"),
    (t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (t[(t.Fetch = 6)] = "Fetch"),
    t
  );
})(kD || {});
function Ax(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function Nx(...t) {
  let e = [
    pt,
    SD,
    ED,
    { provide: ts, useExisting: ED },
    { provide: ic, useExisting: SD },
    { provide: bh, useValue: xx, multi: !0 },
    { provide: FD, useValue: !0 },
    { provide: ac, useClass: Tx },
  ];
  for (let r of t) e.push(...r.ɵproviders);
  return Vi(e);
}
var ID = new A("");
function Ox() {
  return Ax(kD.LegacyInterceptors, [
    { provide: ID, useFactory: bx },
    { provide: bh, useExisting: ID, multi: !0 },
  ]);
}
var LD = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Fe({ type: e })),
    (e.ɵinj = ke({ providers: [Nx(Ox())] }));
  let t = e;
  return t;
})();
var MD = "b",
  TD = "h",
  xD = "s",
  AD = "st",
  ND = "u",
  OD = "rt",
  rc = new A(""),
  Px = ["GET", "HEAD"];
function Rx(t, e) {
  let u = C(rc),
    { isCacheActive: r } = u,
    n = qs(u, ["isCacheActive"]),
    { transferCache: i, method: o } = t;
  if (
    !r ||
    (o === "POST" && !n.includePostRequests && !i) ||
    (o !== "POST" && !Px.includes(o)) ||
    i === !1 ||
    n.filter?.(t) === !1
  )
    return e(t);
  let s = C(Zr),
    a = kx(t),
    l = s.get(a, null),
    c = n.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (c = i.includeHeaders), l)) {
    let { [MD]: d, [OD]: p, [TD]: g, [xD]: v, [AD]: S, [ND]: x } = l,
      T = d;
    switch (p) {
      case "arraybuffer":
        T = new TextEncoder().encode(d).buffer;
        break;
      case "blob":
        T = new Blob([d]);
        break;
    }
    let j = new qt(g);
    return P(new Gi({ body: T, headers: j, status: v, statusText: S, url: x }));
  }
  return e(t).pipe(
    N((d) => {
      d instanceof Gi &&
        s.set(a, {
          [MD]: d.body,
          [TD]: Fx(d.headers, c),
          [xD]: d.status,
          [AD]: d.statusText,
          [ND]: d.url || "",
          [OD]: t.responseType,
        });
    })
  );
}
function Fx(t, e) {
  if (!e) return {};
  let r = {};
  for (let n of e) {
    let i = t.getAll(n);
    i !== null && (r[n] = i);
  }
  return r;
}
function kx(t) {
  let { params: e, method: r, responseType: n, url: i, body: o } = t,
    s = e
      .keys()
      .sort()
      .map((u) => `${u}=${e.getAll(u)}`)
      .join("&"),
    l = [r, n, i, typeof o == "string" ? o : "", s].join("|"),
    c = Lx(l);
  return c;
}
function Lx(t) {
  let e = 0;
  for (let r of t) e = (Math.imul(31, e) + r.charCodeAt(0)) << 0;
  return (e += 2147483648), e.toString();
}
function VD(t) {
  return [
    {
      provide: rc,
      useFactory: () => (
        Jr("NgHttpTransferCache"), I({ isCacheActive: !0 }, t)
      ),
    },
    { provide: RD, useValue: Rx, multi: !0, deps: [Zr, rc] },
    {
      provide: Ui,
      multi: !0,
      useFactory: () => {
        let e = C(qn),
          r = C(rc);
        return () => {
          Xf(e).then(() => {
            r.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
var Eh = class extends Zl {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Sh = class t extends Eh {
    static makeCurrent() {
      sD(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = Vx();
      return r == null ? null : jx(r);
    }
    resetBaseElement() {
      rs = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return ec(document.cookie, e);
    }
  },
  rs = null;
function Vx() {
  return (
    (rs = rs || document.querySelector("base")),
    rs ? rs.getAttribute("href") : null
  );
}
function jx(t) {
  return new URL(t, document.baseURI).pathname;
}
var Ih = class {
    addToWindow(e) {
      (Pe.getAngularTestability = (n, i = !0) => {
        let o = e.findTestabilityInTree(n, i);
        if (o == null) throw new b(5103, !1);
        return o;
      }),
        (Pe.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (Pe.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let i = Pe.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && n();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      Pe.frameworkStabilizers || (Pe.frameworkStabilizers = []),
        Pe.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let i = e.getTestability(r);
      return (
        i ??
        (n
          ? Sn().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  $x = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Mh = new A(""),
  BD = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new b(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Mh), w(ee));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  lc = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Ch = "ng-app-id",
  UD = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = mh(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Ch}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(Ch), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Ch, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Ce), w(Ho), w(gf, 8), w(ft));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  _h = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Ah = /%COMP%/g,
  HD = "%COMP%",
  Bx = `_nghost-${HD}`,
  Ux = `_ngcontent-${HD}`,
  Hx = !0,
  zx = new A("", { providedIn: "root", factory: () => Hx });
function qx(t) {
  return Ux.replace(Ah, t);
}
function Gx(t) {
  return Bx.replace(Ah, t);
}
function zD(t, e) {
  return e.map((r) => r.replace(Ah, t));
}
var cc = (() => {
    let e = class e {
      constructor(n, i, o, s, a, l, c, u = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = l),
          (this.ngZone = c),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = mh(l)),
          (this.defaultRenderer = new is(n, a, c, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === Dn.ShadowDom &&
          (i = te(I({}, i), { encapsulation: Dn.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof uc
            ? o.applyToHost(n)
            : o instanceof os && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            l = this.ngZone,
            c = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            p = this.platformIsServer;
          switch (i.encapsulation) {
            case Dn.Emulated:
              s = new uc(c, u, i, this.appId, d, a, l, p);
              break;
            case Dn.ShadowDom:
              return new Th(c, u, n, i, a, l, this.nonce, p);
            default:
              s = new os(c, u, i, d, a, l, p);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        w(BD),
        w(UD),
        w(Ho),
        w(zx),
        w(Ce),
        w(ft),
        w(ee),
        w(gf)
      );
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  is = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(_h[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (jD(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (jD(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new b(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = _h[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = _h[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (wn.DashCase | wn.Important)
        ? e.style.setProperty(r, n, i & wn.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & wn.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = Sn().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function jD(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Th = class extends is {
    constructor(e, r, n, i, o, s, a, l) {
      super(e, o, s, l),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = zD(i.id, i.styles);
      for (let u of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  os = class extends is {
    constructor(e, r, n, i, o, s, a, l) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = l ? zD(l, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  uc = class extends os {
    constructor(e, r, n, i, o, s, a, l) {
      let c = i + "-" + n.id;
      super(e, r, n, o, s, a, l, c),
        (this.contentAttr = qx(c)),
        (this.hostAttr = Gx(c));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  Wx = (() => {
    let e = class e extends lc {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Ce));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  $D = ["alt", "control", "meta", "shift"],
  Qx = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Kx = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  Yx = (() => {
    let e = class e extends lc {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Sn().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          l = i.indexOf("code");
        if (
          (l > -1 && (i.splice(l, 1), (a = "code.")),
          $D.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(n, i) {
        let o = Qx[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              $D.forEach((a) => {
                if (a !== o) {
                  let l = Kx[a];
                  l(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(Ce));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Zx() {
  Sh.makeCurrent();
}
function Jx() {
  return new Bt();
}
function Xx() {
  return Ov(document), document;
}
var eA = [
    { provide: ft, useValue: gh },
    { provide: hf, useValue: Zx, multi: !0 },
    { provide: Ce, useFactory: Xx, deps: [] },
  ],
  qD = eh(W0, "browser", eA),
  tA = new A(""),
  nA = [
    { provide: Ko, useClass: Ih, deps: [] },
    { provide: Zf, useClass: jl, deps: [ee, $l, Ko] },
    { provide: jl, useClass: jl, deps: [ee, $l, Ko] },
  ],
  rA = [
    { provide: vl, useValue: "root" },
    { provide: Bt, useFactory: Jx, deps: [] },
    { provide: Mh, useClass: Wx, multi: !0, deps: [Ce, ee, ft] },
    { provide: Mh, useClass: Yx, multi: !0, deps: [Ce] },
    cc,
    UD,
    BD,
    { provide: Gr, useExisting: cc },
    { provide: Hi, useClass: $x, deps: [] },
    [],
  ],
  dc = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: Ho, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(tA, 12));
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({ providers: [...rA, ...nA], imports: [tc, Q0] }));
    let t = e;
    return t;
  })();
var GD = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(Ce));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var xh = (function (t) {
  return (
    (t[(t.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (t[(t.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    t
  );
})(xh || {});
function WD(...t) {
  let e = [],
    r = new Set(),
    n = r.has(xh.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: o } of t) r.add(o), i.length && e.push(i);
  return Vi([[], K0(), r.has(xh.NoHttpTransferCache) || n ? [] : VD({}), e]);
}
var iw = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(bt), y(He));
    }),
      (e.ɵdir = ue({ type: e }));
    let t = e;
    return t;
  })(),
  Rh = (() => {
    let e = class e extends iw {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = fr(e)))(o || e);
      };
    })()),
      (e.ɵdir = ue({ type: e, features: [Rt] }));
    let t = e;
    return t;
  })(),
  us = new A("");
var iA = { provide: us, useExisting: sn(() => It), multi: !0 };
function oA() {
  let t = Sn() ? Sn().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var sA = new A(""),
  It = (() => {
    let e = class e extends iw {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !oA());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(bt), y(He), y(sA, 8));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            U("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [Me([iA]), Rt],
      }));
    let t = e;
    return t;
  })();
function mr(t) {
  return (
    t == null || ((typeof t == "string" || Array.isArray(t)) && t.length === 0)
  );
}
function ow(t) {
  return t != null && typeof t.length == "number";
}
var ds = new A(""),
  wc = new A(""),
  aA =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  vr = class {
    static min(e) {
      return lA(e);
    }
    static max(e) {
      return cA(e);
    }
    static required(e) {
      return sw(e);
    }
    static requiredTrue(e) {
      return uA(e);
    }
    static email(e) {
      return dA(e);
    }
    static minLength(e) {
      return fA(e);
    }
    static maxLength(e) {
      return hA(e);
    }
    static pattern(e) {
      return pA(e);
    }
    static nullValidator(e) {
      return hc(e);
    }
    static compose(e) {
      return fw(e);
    }
    static composeAsync(e) {
      return hw(e);
    }
  };
function lA(t) {
  return (e) => {
    if (mr(e.value) || mr(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r < t ? { min: { min: t, actual: e.value } } : null;
  };
}
function cA(t) {
  return (e) => {
    if (mr(e.value) || mr(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r > t ? { max: { max: t, actual: e.value } } : null;
  };
}
function sw(t) {
  return mr(t.value) ? { required: !0 } : null;
}
function uA(t) {
  return t.value === !0 ? null : { required: !0 };
}
function dA(t) {
  return mr(t.value) || aA.test(t.value) ? null : { email: !0 };
}
function fA(t) {
  return (e) =>
    mr(e.value) || !ow(e.value)
      ? null
      : e.value.length < t
      ? { minlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function hA(t) {
  return (e) =>
    ow(e.value) && e.value.length > t
      ? { maxlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function pA(t) {
  if (!t) return hc;
  let e, r;
  return (
    typeof t == "string"
      ? ((r = ""),
        t.charAt(0) !== "^" && (r += "^"),
        (r += t),
        t.charAt(t.length - 1) !== "$" && (r += "$"),
        (e = new RegExp(r)))
      : ((r = t.toString()), (e = t)),
    (n) => {
      if (mr(n.value)) return null;
      let i = n.value;
      return e.test(i)
        ? null
        : { pattern: { requiredPattern: r, actualValue: i } };
    }
  );
}
function hc(t) {
  return null;
}
function aw(t) {
  return t != null;
}
function lw(t) {
  return ei(t) ? se(t) : t;
}
function cw(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? I(I({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function uw(t, e) {
  return e.map((r) => r(t));
}
function gA(t) {
  return !t.validate;
}
function dw(t) {
  return t.map((e) => (gA(e) ? e : (r) => e.validate(r)));
}
function fw(t) {
  if (!t) return null;
  let e = t.filter(aw);
  return e.length == 0
    ? null
    : function (r) {
        return cw(uw(r, e));
      };
}
function Fh(t) {
  return t != null ? fw(dw(t)) : null;
}
function hw(t) {
  if (!t) return null;
  let e = t.filter(aw);
  return e.length == 0
    ? null
    : function (r) {
        let n = uw(r, e).map(lw);
        return Au(n).pipe(F(cw));
      };
}
function kh(t) {
  return t != null ? hw(dw(t)) : null;
}
function KD(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function pw(t) {
  return t._rawValidators;
}
function gw(t) {
  return t._rawAsyncValidators;
}
function Nh(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function pc(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function YD(t, e) {
  let r = Nh(e);
  return (
    Nh(t).forEach((i) => {
      pc(r, i) || r.push(i);
    }),
    r
  );
}
function ZD(t, e) {
  return Nh(e).filter((r) => !pc(t, r));
}
var gc = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = Fh(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = kh(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  Yn = class extends gc {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  ni = class extends gc {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  mc = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  mA = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  Q4 = te(I({}, mA), { "[class.ng-submitted]": "isSubmitted" }),
  Gt = (() => {
    let e = class e extends mc {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(ni, 2));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            Ol("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [Rt],
      }));
    let t = e;
    return t;
  })(),
  yr = (() => {
    let e = class e extends mc {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Yn, 10));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            Ol("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        features: [Rt],
      }));
    let t = e;
    return t;
  })();
var ss = "VALID",
  fc = "INVALID",
  Wi = "PENDING",
  as = "DISABLED";
function Lh(t) {
  return (bc(t) ? t.validators : t) || null;
}
function vA(t) {
  return Array.isArray(t) ? Fh(t) : t || null;
}
function Vh(t, e) {
  return (bc(e) ? e.asyncValidators : t) || null;
}
function yA(t) {
  return Array.isArray(t) ? kh(t) : t || null;
}
function bc(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
function mw(t, e, r) {
  let n = t.controls;
  if (!(e ? Object.keys(n) : n).length) throw new b(1e3, "");
  if (!n[r]) throw new b(1001, "");
}
function vw(t, e, r) {
  t._forEachChild((n, i) => {
    if (r[i] === void 0) throw new b(1002, "");
  });
}
var Qi = class {
    constructor(e, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === ss;
    }
    get invalid() {
      return this.status === fc;
    }
    get pending() {
      return this.status == Wi;
    }
    get disabled() {
      return this.status === as;
    }
    get enabled() {
      return this.status !== as;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(YD(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(YD(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(ZD(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(ZD(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return pc(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return pc(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      (this.touched = !0),
        this._parent && !e.onlySelf && this._parent.markAsTouched(e);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild((e) => e.markAllAsTouched());
    }
    markAsUntouched(e = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((r) => {
          r.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    markAsDirty(e = {}) {
      (this.pristine = !1),
        this._parent && !e.onlySelf && this._parent.markAsDirty(e);
    }
    markAsPristine(e = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((r) => {
          r.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    markAsPending(e = {}) {
      (this.status = Wi),
        e.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !e.onlySelf && this._parent.markAsPending(e);
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = as),
        (this.errors = null),
        this._forEachChild((n) => {
          n.disable(te(I({}, e), { onlySelf: !0 }));
        }),
        this._updateValue(),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors(te(I({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!0));
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = ss),
        this._forEachChild((n) => {
          n.enable(te(I({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(te(I({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(e) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched());
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === ss || this.status === Wi) &&
            this._runAsyncValidator(e.emitEvent)),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? as : ss;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e) {
      if (this.asyncValidator) {
        (this.status = Wi), (this._hasOwnPendingAsyncValidator = !0);
        let r = lw(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((n) => {
          (this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(n, { emitEvent: e });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(e, r = {}) {
      (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
    }
    get(e) {
      let r = e;
      return r == null ||
        (Array.isArray(r) || (r = r.split(".")), r.length === 0)
        ? null
        : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(e, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[e] : null;
    }
    hasError(e, r) {
      return !!this.getError(e, r);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(e);
    }
    _initObservables() {
      (this.valueChanges = new ae()), (this.statusChanges = new ae());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? as
        : this.errors
        ? fc
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Wi)
        ? Wi
        : this._anyControlsHaveStatus(fc)
        ? fc
        : ss;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((r) => r.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e = {}) {
      (this.pristine = !this._anyControlsDirty()),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    _updateTouched(e = {}) {
      (this.touched = this._anyControlsTouched()),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      bc(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty;
      return !e && !!r && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = vA(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = yA(this._rawAsyncValidators));
    }
  },
  Ki = class extends Qi {
    constructor(e, r, n) {
      super(Lh(r), Vh(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r);
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(e, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, r, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, r = {}) {
      vw(this, !0, e),
        Object.keys(e).forEach((n) => {
          mw(this, !0, n),
            this.controls[n].setValue(e[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, r, n) => ((e[n] = r.getRawValue()), e)
      );
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && e(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && e(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(
        e,
        (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r)
      );
    }
    _reduceChildren(e, r) {
      let n = e;
      return (
        this._forEachChild((i, o) => {
          n = r(n, i, o);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var Oh = class extends Ki {};
var fs = new A("CallSetDisabledState", {
    providedIn: "root",
    factory: () => Cc,
  }),
  Cc = "always";
function yw(t, e) {
  return [...e.path, t];
}
function vc(t, e, r = Cc) {
  jh(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    wA(t, e),
    CA(t, e),
    bA(t, e),
    DA(t, e);
}
function JD(t, e, r = !0) {
  let n = () => {};
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    Dc(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function yc(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function DA(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function jh(t, e) {
  let r = pw(t);
  e.validator !== null
    ? t.setValidators(KD(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = gw(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(KD(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  yc(e._rawValidators, i), yc(e._rawAsyncValidators, i);
}
function Dc(t, e) {
  let r = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = pw(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.validator);
        o.length !== i.length && ((r = !0), t.setValidators(o));
      }
    }
    if (e.asyncValidator !== null) {
      let i = gw(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.asyncValidator);
        o.length !== i.length && ((r = !0), t.setAsyncValidators(o));
      }
    }
  }
  let n = () => {};
  return yc(e._rawValidators, n), yc(e._rawAsyncValidators, n), r;
}
function wA(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && Dw(t, e);
  });
}
function bA(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && Dw(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function Dw(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function CA(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function ww(t, e) {
  t == null, jh(t, e);
}
function _A(t, e) {
  return Dc(t, e);
}
function bw(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function EA(t) {
  return Object.getPrototypeOf(t.constructor) === Rh;
}
function Cw(t, e) {
  t._syncPendingControls(),
    e.forEach((r) => {
      let n = r.control;
      n.updateOn === "submit" &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function _w(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === It ? (r = o) : EA(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function SA(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
var IA = { provide: Yn, useExisting: sn(() => ri) },
  ls = Promise.resolve(),
  ri = (() => {
    let e = class e extends Yn {
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._directives = new Set()),
          (this.ngSubmit = new ae()),
          (this.form = new Ki({}, Fh(n), kh(i)));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(n) {
        ls.then(() => {
          let i = this._findContainer(n.path);
          (n.control = i.registerControl(n.name, n.control)),
            vc(n.control, n, this.callSetDisabledState),
            n.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(n);
        });
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        ls.then(() => {
          let i = this._findContainer(n.path);
          i && i.removeControl(n.name), this._directives.delete(n);
        });
      }
      addFormGroup(n) {
        ls.then(() => {
          let i = this._findContainer(n.path),
            o = new Ki({});
          ww(o, n),
            i.registerControl(n.name, o),
            o.updateValueAndValidity({ emitEvent: !1 });
        });
      }
      removeFormGroup(n) {
        ls.then(() => {
          let i = this._findContainer(n.path);
          i && i.removeControl(n.name);
        });
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        ls.then(() => {
          this.form.get(n.path).setValue(i);
        });
      }
      setValue(n) {
        this.control.setValue(n);
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          Cw(this.form, this._directives),
          this.ngSubmit.emit(n),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(n) {
        return n.pop(), n.length ? this.form.get(n) : this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(ds, 10), y(wc, 10), y(fs, 8));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
          ["ng-form"],
          ["", "ngForm", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            U("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { options: [Re.None, "ngFormOptions", "options"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [Me([IA]), Rt],
      }));
    let t = e;
    return t;
  })();
function XD(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function ew(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var cs = class extends Qi {
  constructor(e = null, r, n) {
    super(Lh(r), Vh(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      bc(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (ew(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    XD(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    XD(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    ew(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var MA = (t) => t instanceof cs;
var TA = { provide: ni, useExisting: sn(() => un) },
  tw = Promise.resolve(),
  un = (() => {
    let e = class e extends ni {
      constructor(n, i, o, s, a, l) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = l),
          (this.control = new cs()),
          (this._registered = !1),
          (this.name = ""),
          (this.update = new ae()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = _w(this, s));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || "name" in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue;
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in n && this._updateDisabled(n),
          bw(n, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        vc(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName();
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        tw.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && pr(i);
        tw.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? yw(n, this._parent) : [n];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        y(Yn, 9),
        y(ds, 10),
        y(wc, 10),
        y(us, 10),
        y(En, 8),
        y(fs, 8)
      );
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: [Re.None, "disabled", "isDisabled"],
          model: [Re.None, "ngModel", "model"],
          options: [Re.None, "ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        features: [Me([TA]), Rt, Dt],
      }));
    let t = e;
    return t;
  })(),
  Dr = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
      }));
    let t = e;
    return t;
  })();
var Ew = new A("");
var xA = { provide: Yn, useExisting: sn(() => $h) },
  $h = (() => {
    let e = class e extends Yn {
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new ae()),
          this._setValidators(n),
          this._setAsyncValidators(i);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Dc(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let i = this.form.get(n.path);
        return (
          vc(i, n, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          i
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        JD(n.control || null, n, !1), SA(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        this.form.get(n.path).setValue(i);
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          Cw(this.form, this.directives),
          this.ngSubmit.emit(n),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1);
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let i = n.control,
            o = this.form.get(n.path);
          i !== o &&
            (JD(i || null, n),
            MA(o) && (vc(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let i = this.form.get(n.path);
        ww(i, n), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let i = this.form.get(n.path);
          i && _A(i, n) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        jh(this.form, this), this._oldForm && Dc(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(ds, 10), y(wc, 10), y(fs, 8));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (i, o) {
          i & 1 &&
            U("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { form: [Re.None, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [Me([xA]), Rt, Dt],
      }));
    let t = e;
    return t;
  })();
var AA = { provide: ni, useExisting: sn(() => Bh) },
  Bh = (() => {
    let e = class e extends ni {
      set isDisabled(n) {}
      constructor(n, i, o, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new ae()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = _w(this, s));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          bw(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return yw(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(
          y(Yn, 13),
          y(ds, 10),
          y(wc, 10),
          y(us, 10),
          y(Ew, 8)
        );
      }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [Re.None, "formControlName", "name"],
          isDisabled: [Re.None, "disabled", "isDisabled"],
          model: [Re.None, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        features: [Me([AA]), Rt, Dt],
      }));
    let t = e;
    return t;
  })(),
  NA = { provide: us, useExisting: sn(() => Yi), multi: !0 };
function Sw(t, e) {
  return t == null
    ? `${e}`
    : (e && typeof e == "object" && (e = "Object"), `${t}: ${e}`.slice(0, 50));
}
function OA(t) {
  return t.split(":")[0];
}
var Yi = (() => {
    let e = class e extends Rh {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i = this._getOptionId(n),
          o = Sw(i, n);
        this.setProperty("value", o);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          (this.value = this._getOptionValue(i)), n(this.value);
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i), n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = OA(n);
        return this._optionMap.has(i) ? this._optionMap.get(i) : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = fr(e)))(o || e);
      };
    })()),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["select", "formControlName", "", 3, "multiple", ""],
          ["select", "formControl", "", 3, "multiple", ""],
          ["select", "ngModel", "", 3, "multiple", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            U("change", function (a) {
              return o.onChange(a.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [Me([NA]), Rt],
      }));
    let t = e;
    return t;
  })(),
  Zi = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption());
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(Sw(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._setElementValue(n),
          this._select && this._select.writeValue(this._select.value);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(He), y(bt), y(Yi, 9));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })(),
  PA = { provide: us, useExisting: sn(() => Iw), multi: !0 };
function nw(t, e) {
  return t == null
    ? `${e}`
    : (typeof e == "string" && (e = `'${e}'`),
      e && typeof e == "object" && (e = "Object"),
      `${t}: ${e}`.slice(0, 50));
}
function RA(t) {
  return t.split(":")[0];
}
var Iw = (() => {
    let e = class e extends Rh {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i;
        if (Array.isArray(n)) {
          let o = n.map((s) => this._getOptionId(s));
          i = (s, a) => {
            s._setSelected(o.indexOf(a.toString()) > -1);
          };
        } else
          i = (o, s) => {
            o._setSelected(!1);
          };
        this._optionMap.forEach(i);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          let o = [],
            s = i.selectedOptions;
          if (s !== void 0) {
            let a = s;
            for (let l = 0; l < a.length; l++) {
              let c = a[l],
                u = this._getOptionValue(c.value);
              o.push(u);
            }
          } else {
            let a = i.options;
            for (let l = 0; l < a.length; l++) {
              let c = a[l];
              if (c.selected) {
                let u = this._getOptionValue(c.value);
                o.push(u);
              }
            }
          }
          (this.value = o), n(o);
        };
      }
      _registerOption(n) {
        let i = (this._idCounter++).toString();
        return this._optionMap.set(i, n), i;
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i)._value, n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = RA(n);
        return this._optionMap.has(i) ? this._optionMap.get(i)._value : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = fr(e)))(o || e);
      };
    })()),
      (e.ɵdir = ue({
        type: e,
        selectors: [
          ["select", "multiple", "", "formControlName", ""],
          ["select", "multiple", "", "formControl", ""],
          ["select", "multiple", "", "ngModel", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            U("change", function (a) {
              return o.onChange(a.target);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [Me([PA]), Rt],
      }));
    let t = e;
    return t;
  })(),
  Ji = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption(this));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(nw(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(nw(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, "selected", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(He), y(bt), y(Iw, 9));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })();
var FA = (() => {
  let e = class e {
    constructor() {
      this._validator = hc;
    }
    ngOnChanges(n) {
      if (this.inputName in n) {
        let i = this.normalizeInput(n[this.inputName].currentValue);
        (this._enabled = this.enabled(i)),
          (this._validator = this._enabled ? this.createValidator(i) : hc),
          this._onChange && this._onChange();
      }
    }
    validate(n) {
      return this._validator(n);
    }
    registerOnValidatorChange(n) {
      this._onChange = n;
    }
    enabled(n) {
      return n != null;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵdir = ue({ type: e, features: [Dt] }));
  let t = e;
  return t;
})();
var kA = { provide: ds, useExisting: sn(() => Zn), multi: !0 };
var Zn = (() => {
  let e = class e extends FA {
    constructor() {
      super(...arguments),
        (this.inputName = "required"),
        (this.normalizeInput = pr),
        (this.createValidator = (n) => sw);
    }
    enabled(n) {
      return n;
    }
  };
  (e.ɵfac = (() => {
    let n;
    return function (o) {
      return (n || (n = fr(e)))(o || e);
    };
  })()),
    (e.ɵdir = ue({
      type: e,
      selectors: [
        ["", "required", "", "formControlName", "", 3, "type", "checkbox"],
        ["", "required", "", "formControl", "", 3, "type", "checkbox"],
        ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
      ],
      hostVars: 1,
      hostBindings: function (i, o) {
        i & 2 && hr("required", o._enabled ? "" : null);
      },
      inputs: { required: "required" },
      features: [Me([kA]), Rt],
    }));
  let t = e;
  return t;
})();
var Mw = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({}));
    let t = e;
    return t;
  })(),
  Ph = class extends Qi {
    constructor(e, r, n) {
      super(Lh(r), Vh(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    at(e) {
      return this.controls[this._adjustIndex(e)];
    }
    push(e, r = {}) {
      this.controls.push(e),
        this._registerControl(e),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    insert(e, r, n = {}) {
      this.controls.splice(e, 0, r),
        this._registerControl(r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent });
    }
    removeAt(e, r = {}) {
      let n = this._adjustIndex(e);
      n < 0 && (n = 0),
        this.controls[n] &&
          this.controls[n]._registerOnCollectionChange(() => {}),
        this.controls.splice(n, 1),
        this.updateValueAndValidity({ emitEvent: r.emitEvent });
    }
    setControl(e, r, n = {}) {
      let i = this._adjustIndex(e);
      i < 0 && (i = 0),
        this.controls[i] &&
          this.controls[i]._registerOnCollectionChange(() => {}),
        this.controls.splice(i, 1),
        r && (this.controls.splice(i, 0, r), this._registerControl(r)),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(e, r = {}) {
      vw(this, !1, e),
        e.forEach((n, i) => {
          mw(this, !1, i),
            this.at(i).setValue(n, { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (e.forEach((n, i) => {
          this.at(i) &&
            this.at(i).patchValue(n, { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = [], r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e[i], { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this.controls.map((e) => e.getRawValue());
    }
    clear(e = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((r) => r._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: e.emitEvent }));
    }
    _adjustIndex(e) {
      return e < 0 ? e + this.length : e;
    }
    _syncPendingControls() {
      let e = this.controls.reduce(
        (r, n) => (n._syncPendingControls() ? !0 : r),
        !1
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      this.controls.forEach((r, n) => {
        e(r, n);
      });
    }
    _updateValue() {
      this.value = this.controls
        .filter((e) => e.enabled || this.disabled)
        .map((e) => e.value);
    }
    _anyControls(e) {
      return this.controls.some((r) => r.enabled && e(r));
    }
    _setUpControls() {
      this._forEachChild((e) => this._registerControl(e));
    }
    _allControlsDisabled() {
      for (let e of this.controls) if (e.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(e) {
      e.setParent(this),
        e._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(e) {
      return this.at(e) ?? null;
    }
  };
function rw(t) {
  return (
    !!t &&
    (t.asyncValidators !== void 0 ||
      t.validators !== void 0 ||
      t.updateOn !== void 0)
  );
}
var Tw = (() => {
  let e = class e {
    constructor() {
      this.useNonNullable = !1;
    }
    get nonNullable() {
      let n = new e();
      return (n.useNonNullable = !0), n;
    }
    group(n, i = null) {
      let o = this._reduceControls(n),
        s = {};
      return (
        rw(i)
          ? (s = i)
          : i !== null &&
            ((s.validators = i.validator),
            (s.asyncValidators = i.asyncValidator)),
        new Ki(o, s)
      );
    }
    record(n, i = null) {
      let o = this._reduceControls(n);
      return new Oh(o, i);
    }
    control(n, i, o) {
      let s = {};
      return this.useNonNullable
        ? (rw(i) ? (s = i) : ((s.validators = i), (s.asyncValidators = o)),
          new cs(n, te(I({}, s), { nonNullable: !0 })))
        : new cs(n, i, o);
    }
    array(n, i, o) {
      let s = n.map((a) => this._createControl(a));
      return new Ph(s, i, o);
    }
    _reduceControls(n) {
      let i = {};
      return (
        Object.keys(n).forEach((o) => {
          i[o] = this._createControl(n[o]);
        }),
        i
      );
    }
    _createControl(n) {
      if (n instanceof cs) return n;
      if (n instanceof Qi) return n;
      if (Array.isArray(n)) {
        let i = n[0],
          o = n.length > 1 ? n[1] : null,
          s = n.length > 2 ? n[2] : null;
        return this.control(i, o, s);
      } else return this.control(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var xw = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [{ provide: fs, useValue: n.callSetDisabledState ?? Cc }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({ imports: [Mw] }));
    let t = e;
    return t;
  })(),
  Aw = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [
            {
              provide: Ew,
              useValue: n.warnOnNgModelWithFormControl ?? "always",
            },
            { provide: fs, useValue: n.callSetDisabledState ?? Cc },
          ],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({ imports: [Mw] }));
    let t = e;
    return t;
  })();
var q = (function (t) {
    return (
      (t[(t.State = 0)] = "State"),
      (t[(t.Transition = 1)] = "Transition"),
      (t[(t.Sequence = 2)] = "Sequence"),
      (t[(t.Group = 3)] = "Group"),
      (t[(t.Animate = 4)] = "Animate"),
      (t[(t.Keyframes = 5)] = "Keyframes"),
      (t[(t.Style = 6)] = "Style"),
      (t[(t.Trigger = 7)] = "Trigger"),
      (t[(t.Reference = 8)] = "Reference"),
      (t[(t.AnimateChild = 9)] = "AnimateChild"),
      (t[(t.AnimateRef = 10)] = "AnimateRef"),
      (t[(t.Query = 11)] = "Query"),
      (t[(t.Stagger = 12)] = "Stagger"),
      t
    );
  })(q || {}),
  Tn = "*";
function Nw(t, e) {
  return { type: q.Trigger, name: t, definitions: e, options: {} };
}
function Uh(t, e = null) {
  return { type: q.Animate, styles: e, timings: t };
}
function Ow(t, e = null) {
  return { type: q.Sequence, steps: t, options: e };
}
function eo(t) {
  return { type: q.Style, styles: t, offset: null };
}
function Hh(t, e, r) {
  return { type: q.State, name: t, styles: e, options: r };
}
function zh(t, e, r = null) {
  return { type: q.Transition, expr: t, animation: e, options: r };
}
var wr = class {
    constructor(e = 0, r = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = e + r);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(e) {
      this._position = this.totalTime ? e * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(e) {
      let r = e == "start" ? this._onStartFns : this._onDoneFns;
      r.forEach((n) => n()), (r.length = 0);
    }
  },
  hs = class {
    constructor(e) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = e);
      let r = 0,
        n = 0,
        i = 0,
        o = this.players.length;
      o == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++r == o && this._onFinish();
            }),
              s.onDestroy(() => {
                ++n == o && this._onDestroy();
              }),
              s.onStart(() => {
                ++i == o && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((e) => e.init());
    }
    onStart(e) {
      this._onStartFns.push(e);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((e) => e()),
        (this._onStartFns = []));
    }
    onDone(e) {
      this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((e) => e.play());
    }
    pause() {
      this.players.forEach((e) => e.pause());
    }
    restart() {
      this.players.forEach((e) => e.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((e) => e.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((e) => e.destroy()),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((e) => e.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(e) {
      let r = e * this.totalTime;
      this.players.forEach((n) => {
        let i = n.totalTime ? Math.min(1, r / n.totalTime) : 1;
        n.setPosition(i);
      });
    }
    getPosition() {
      let e = this.players.reduce(
        (r, n) => (r === null || n.totalTime > r.totalTime ? n : r),
        null
      );
      return e != null ? e.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((e) => {
        e.beforeDestroy && e.beforeDestroy();
      });
    }
    triggerCallback(e) {
      let r = e == "start" ? this._onStartFns : this._onDoneFns;
      r.forEach((n) => n()), (r.length = 0);
    }
  },
  _c = "!";
function Pw(t) {
  return new b(3e3, !1);
}
function LA() {
  return new b(3100, !1);
}
function VA() {
  return new b(3101, !1);
}
function jA(t) {
  return new b(3001, !1);
}
function $A(t) {
  return new b(3003, !1);
}
function BA(t) {
  return new b(3004, !1);
}
function UA(t, e) {
  return new b(3005, !1);
}
function HA() {
  return new b(3006, !1);
}
function zA() {
  return new b(3007, !1);
}
function qA(t, e) {
  return new b(3008, !1);
}
function GA(t) {
  return new b(3002, !1);
}
function WA(t, e, r, n, i) {
  return new b(3010, !1);
}
function QA() {
  return new b(3011, !1);
}
function KA() {
  return new b(3012, !1);
}
function YA() {
  return new b(3200, !1);
}
function ZA() {
  return new b(3202, !1);
}
function JA() {
  return new b(3013, !1);
}
function XA(t) {
  return new b(3014, !1);
}
function eN(t) {
  return new b(3015, !1);
}
function tN(t) {
  return new b(3016, !1);
}
function nN(t, e) {
  return new b(3404, !1);
}
function rN(t) {
  return new b(3502, !1);
}
function iN(t) {
  return new b(3503, !1);
}
function oN() {
  return new b(3300, !1);
}
function sN(t) {
  return new b(3504, !1);
}
function aN(t) {
  return new b(3301, !1);
}
function lN(t, e) {
  return new b(3302, !1);
}
function cN(t) {
  return new b(3303, !1);
}
function uN(t, e) {
  return new b(3400, !1);
}
function dN(t) {
  return new b(3401, !1);
}
function fN(t) {
  return new b(3402, !1);
}
function hN(t, e) {
  return new b(3505, !1);
}
function br(t) {
  switch (t.length) {
    case 0:
      return new wr();
    case 1:
      return t[0];
    default:
      return new hs(t);
  }
}
function Ww(t, e, r = new Map(), n = new Map()) {
  let i = [],
    o = [],
    s = -1,
    a = null;
  if (
    (e.forEach((l) => {
      let c = l.get("offset"),
        u = c == s,
        d = (u && a) || new Map();
      l.forEach((p, g) => {
        let v = g,
          S = p;
        if (g !== "offset")
          switch (((v = t.normalizePropertyName(v, i)), S)) {
            case _c:
              S = r.get(g);
              break;
            case Tn:
              S = n.get(g);
              break;
            default:
              S = t.normalizeStyleValue(g, v, S, i);
              break;
          }
        d.set(v, S);
      }),
        u || o.push(d),
        (a = d),
        (s = c);
    }),
    i.length)
  )
    throw rN(i);
  return o;
}
function hp(t, e, r, n) {
  switch (e) {
    case "start":
      t.onStart(() => n(r && qh(r, "start", t)));
      break;
    case "done":
      t.onDone(() => n(r && qh(r, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => n(r && qh(r, "destroy", t)));
      break;
  }
}
function qh(t, e, r) {
  let n = r.totalTime,
    i = !!r.disabled,
    o = pp(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      n ?? t.totalTime,
      i
    ),
    s = t._data;
  return s != null && (o._data = s), o;
}
function pp(t, e, r, n, i = "", o = 0, s) {
  return {
    element: t,
    triggerName: e,
    fromState: r,
    toState: n,
    phaseName: i,
    totalTime: o,
    disabled: !!s,
  };
}
function Lt(t, e, r) {
  let n = t.get(e);
  return n || t.set(e, (n = r)), n;
}
function Rw(t) {
  let e = t.indexOf(":"),
    r = t.substring(1, e),
    n = t.slice(e + 1);
  return [r, n];
}
var pN = typeof document > "u" ? null : document.documentElement;
function gp(t) {
  let e = t.parentNode || t.host || null;
  return e === pN ? null : e;
}
function gN(t) {
  return t.substring(1, 6) == "ebkit";
}
var ii = null,
  Fw = !1;
function mN(t) {
  ii ||
    ((ii = vN() || {}), (Fw = ii.style ? "WebkitAppearance" in ii.style : !1));
  let e = !0;
  return (
    ii.style &&
      !gN(t) &&
      ((e = t in ii.style),
      !e &&
        Fw &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in ii.style)),
    e
  );
}
function vN() {
  return typeof document < "u" ? document.body : null;
}
function Qw(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = gp(e);
  }
  return !1;
}
function Kw(t, e, r) {
  if (r) return Array.from(t.querySelectorAll(e));
  let n = t.querySelector(e);
  return n ? [n] : [];
}
var mp = (() => {
    let e = class e {
      validateStyleProperty(n) {
        return mN(n);
      }
      matchesElement(n, i) {
        return !1;
      }
      containsElement(n, i) {
        return Qw(n, i);
      }
      getParentElement(n) {
        return gp(n);
      }
      query(n, i, o) {
        return Kw(n, i, o);
      }
      computeStyle(n, i, o) {
        return o || "";
      }
      animate(n, i, o, s, a, l = [], c) {
        return new wr(o, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  wp = class wp {};
wp.NOOP = new mp();
var ai = wp,
  li = class {};
var yN = 1e3,
  Yw = "{{",
  DN = "}}",
  Zw = "ng-enter",
  Zh = "ng-leave",
  Ec = "ng-trigger",
  xc = ".ng-trigger",
  kw = "ng-animating",
  Jh = ".ng-animating";
function Jn(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : Xh(parseFloat(e[1]), e[2]);
}
function Xh(t, e) {
  switch (e) {
    case "s":
      return t * yN;
    default:
      return t;
  }
}
function Ac(t, e, r) {
  return t.hasOwnProperty("duration") ? t : wN(t, e, r);
}
function wN(t, e, r) {
  let n =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    o = 0,
    s = "";
  if (typeof t == "string") {
    let a = t.match(n);
    if (a === null) return e.push(Pw(t)), { duration: 0, delay: 0, easing: "" };
    i = Xh(parseFloat(a[1]), a[2]);
    let l = a[3];
    l != null && (o = Xh(parseFloat(l), a[4]));
    let c = a[5];
    c && (s = c);
  } else i = t;
  if (!r) {
    let a = !1,
      l = e.length;
    i < 0 && (e.push(LA()), (a = !0)),
      o < 0 && (e.push(VA()), (a = !0)),
      a && e.splice(l, 0, Pw(t));
  }
  return { duration: i, delay: o, easing: s };
}
function bN(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function xn(t, e, r) {
  e.forEach((n, i) => {
    let o = vp(i);
    r && !r.has(i) && r.set(i, t.style[o]), (t.style[o] = n);
  });
}
function si(t, e) {
  e.forEach((r, n) => {
    let i = vp(n);
    t.style[i] = "";
  });
}
function ps(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : Ow(t)) : t;
}
function CN(t, e, r) {
  let n = e.params || {},
    i = Jw(t);
  i.length &&
    i.forEach((o) => {
      n.hasOwnProperty(o) || r.push(jA(o));
    });
}
var ep = new RegExp(`${Yw}\\s*(.+?)\\s*${DN}`, "g");
function Jw(t) {
  let e = [];
  if (typeof t == "string") {
    let r;
    for (; (r = ep.exec(t)); ) e.push(r[1]);
    ep.lastIndex = 0;
  }
  return e;
}
function ms(t, e, r) {
  let n = `${t}`,
    i = n.replace(ep, (o, s) => {
      let a = e[s];
      return a == null && (r.push($A(s)), (a = "")), a.toString();
    });
  return i == n ? t : i;
}
var _N = /-+([a-z0-9])/g;
function vp(t) {
  return t.replace(_N, (...e) => e[1].toUpperCase());
}
function EN(t, e) {
  return t === 0 || e === 0;
}
function SN(t, e, r) {
  if (r.size && e.length) {
    let n = e[0],
      i = [];
    if (
      (r.forEach((o, s) => {
        n.has(s) || i.push(s), n.set(s, o);
      }),
      i.length)
    )
      for (let o = 1; o < e.length; o++) {
        let s = e[o];
        i.forEach((a) => s.set(a, yp(t, a)));
      }
  }
  return e;
}
function kt(t, e, r) {
  switch (e.type) {
    case q.Trigger:
      return t.visitTrigger(e, r);
    case q.State:
      return t.visitState(e, r);
    case q.Transition:
      return t.visitTransition(e, r);
    case q.Sequence:
      return t.visitSequence(e, r);
    case q.Group:
      return t.visitGroup(e, r);
    case q.Animate:
      return t.visitAnimate(e, r);
    case q.Keyframes:
      return t.visitKeyframes(e, r);
    case q.Style:
      return t.visitStyle(e, r);
    case q.Reference:
      return t.visitReference(e, r);
    case q.AnimateChild:
      return t.visitAnimateChild(e, r);
    case q.AnimateRef:
      return t.visitAnimateRef(e, r);
    case q.Query:
      return t.visitQuery(e, r);
    case q.Stagger:
      return t.visitStagger(e, r);
    default:
      throw BA(e.type);
  }
}
function yp(t, e) {
  return window.getComputedStyle(t)[e];
}
var IN = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  Nc = class extends li {
    normalizePropertyName(e, r) {
      return vp(e);
    }
    normalizeStyleValue(e, r, n, i) {
      let o = "",
        s = n.toString().trim();
      if (IN.has(r) && n !== 0 && n !== "0")
        if (typeof n == "number") o = "px";
        else {
          let a = n.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(UA(e, n));
        }
      return s + o;
    }
  };
var Oc = "*";
function MN(t, e) {
  let r = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((n) => TN(n, r, e))
      : r.push(t),
    r
  );
}
function TN(t, e, r) {
  if (t[0] == ":") {
    let l = xN(t, r);
    if (typeof l == "function") {
      e.push(l);
      return;
    }
    t = l;
  }
  let n = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (n == null || n.length < 4) return r.push(eN(t)), e;
  let i = n[1],
    o = n[2],
    s = n[3];
  e.push(Lw(i, s));
  let a = i == Oc && s == Oc;
  o[0] == "<" && !a && e.push(Lw(s, i));
}
function xN(t, e) {
  switch (t) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (r, n) => parseFloat(n) > parseFloat(r);
    case ":decrement":
      return (r, n) => parseFloat(n) < parseFloat(r);
    default:
      return e.push(tN(t)), "* => *";
  }
}
var Sc = new Set(["true", "1"]),
  Ic = new Set(["false", "0"]);
function Lw(t, e) {
  let r = Sc.has(t) || Ic.has(t),
    n = Sc.has(e) || Ic.has(e);
  return (i, o) => {
    let s = t == Oc || t == i,
      a = e == Oc || e == o;
    return (
      !s && r && typeof i == "boolean" && (s = i ? Sc.has(t) : Ic.has(t)),
      !a && n && typeof o == "boolean" && (a = o ? Sc.has(e) : Ic.has(e)),
      s && a
    );
  };
}
var Xw = ":self",
  AN = new RegExp(`s*${Xw}s*,?`, "g");
function eb(t, e, r, n) {
  return new tp(t).build(e, r, n);
}
var Vw = "",
  tp = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, r, n) {
      let i = new np(r);
      return this._resetContextStyleTimingState(i), kt(this, ps(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = Vw),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(Vw, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, r) {
      let n = (r.queryCount = 0),
        i = (r.depCount = 0),
        o = [],
        s = [];
      return (
        e.name.charAt(0) == "@" && r.errors.push(HA()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(r), a.type == q.State)) {
            let l = a,
              c = l.name;
            c
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (l.name = u), o.push(this.visitState(l, r));
              }),
              (l.name = c);
          } else if (a.type == q.Transition) {
            let l = this.visitTransition(a, r);
            (n += l.queryCount), (i += l.depCount), s.push(l);
          } else r.errors.push(zA());
        }),
        {
          type: q.Trigger,
          name: e.name,
          states: o,
          transitions: s,
          queryCount: n,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(e, r) {
      let n = this.visitStyle(e.styles, r),
        i = (e.options && e.options.params) || null;
      if (n.containsDynamicStyles) {
        let o = new Set(),
          s = i || {};
        n.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((l) => {
              Jw(l).forEach((c) => {
                s.hasOwnProperty(c) || o.add(c);
              });
            });
        }),
          o.size && r.errors.push(qA(e.name, [...o.values()]));
      }
      return {
        type: q.State,
        name: e.name,
        style: n,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, r) {
      (r.queryCount = 0), (r.depCount = 0);
      let n = kt(this, ps(e.animation), r),
        i = MN(e.expr, r.errors);
      return {
        type: q.Transition,
        matchers: i,
        animation: n,
        queryCount: r.queryCount,
        depCount: r.depCount,
        options: oi(e.options),
      };
    }
    visitSequence(e, r) {
      return {
        type: q.Sequence,
        steps: e.steps.map((n) => kt(this, n, r)),
        options: oi(e.options),
      };
    }
    visitGroup(e, r) {
      let n = r.currentTime,
        i = 0,
        o = e.steps.map((s) => {
          r.currentTime = n;
          let a = kt(this, s, r);
          return (i = Math.max(i, r.currentTime)), a;
        });
      return (
        (r.currentTime = i), { type: q.Group, steps: o, options: oi(e.options) }
      );
    }
    visitAnimate(e, r) {
      let n = RN(e.timings, r.errors);
      r.currentAnimateTimings = n;
      let i,
        o = e.styles ? e.styles : eo({});
      if (o.type == q.Keyframes) i = this.visitKeyframes(o, r);
      else {
        let s = e.styles,
          a = !1;
        if (!s) {
          a = !0;
          let c = {};
          n.easing && (c.easing = n.easing), (s = eo(c));
        }
        r.currentTime += n.duration + n.delay;
        let l = this.visitStyle(s, r);
        (l.isEmptyStep = a), (i = l);
      }
      return (
        (r.currentAnimateTimings = null),
        { type: q.Animate, timings: n, style: i, options: null }
      );
    }
    visitStyle(e, r) {
      let n = this._makeStyleAst(e, r);
      return this._validateStyleAst(n, r), n;
    }
    _makeStyleAst(e, r) {
      let n = [],
        i = Array.isArray(e.styles) ? e.styles : [e.styles];
      for (let a of i)
        typeof a == "string"
          ? a === Tn
            ? n.push(a)
            : r.errors.push(GA(a))
          : n.push(new Map(Object.entries(a)));
      let o = !1,
        s = null;
      return (
        n.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((s = a.get("easing")), a.delete("easing")), !o)
          ) {
            for (let l of a.values())
              if (l.toString().indexOf(Yw) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: q.Style,
          styles: n,
          easing: s,
          offset: e.offset,
          containsDynamicStyles: o,
          options: null,
        }
      );
    }
    _validateStyleAst(e, r) {
      let n = r.currentAnimateTimings,
        i = r.currentTime,
        o = r.currentTime;
      n && o > 0 && (o -= n.duration + n.delay),
        e.styles.forEach((s) => {
          typeof s != "string" &&
            s.forEach((a, l) => {
              let c = r.collectedStyles.get(r.currentQuerySelector),
                u = c.get(l),
                d = !0;
              u &&
                (o != i &&
                  o >= u.startTime &&
                  i <= u.endTime &&
                  (r.errors.push(WA(l, u.startTime, u.endTime, o, i)),
                  (d = !1)),
                (o = u.startTime)),
                d && c.set(l, { startTime: o, endTime: i }),
                r.options && CN(a, r.options, r.errors);
            });
        });
    }
    visitKeyframes(e, r) {
      let n = { type: q.Keyframes, styles: [], options: null };
      if (!r.currentAnimateTimings) return r.errors.push(QA()), n;
      let i = 1,
        o = 0,
        s = [],
        a = !1,
        l = !1,
        c = 0,
        u = e.steps.map((T) => {
          let j = this._makeStyleAst(T, r),
            ne = j.offset != null ? j.offset : PN(j.styles),
            $ = 0;
          return (
            ne != null && (o++, ($ = j.offset = ne)),
            (l = l || $ < 0 || $ > 1),
            (a = a || $ < c),
            (c = $),
            s.push($),
            j
          );
        });
      l && r.errors.push(KA()), a && r.errors.push(YA());
      let d = e.steps.length,
        p = 0;
      o > 0 && o < d ? r.errors.push(ZA()) : o == 0 && (p = i / (d - 1));
      let g = d - 1,
        v = r.currentTime,
        S = r.currentAnimateTimings,
        x = S.duration;
      return (
        u.forEach((T, j) => {
          let ne = p > 0 ? (j == g ? 1 : p * j) : s[j],
            $ = ne * x;
          (r.currentTime = v + S.delay + $),
            (S.duration = $),
            this._validateStyleAst(T, r),
            (T.offset = ne),
            n.styles.push(T);
        }),
        n
      );
    }
    visitReference(e, r) {
      return {
        type: q.Reference,
        animation: kt(this, ps(e.animation), r),
        options: oi(e.options),
      };
    }
    visitAnimateChild(e, r) {
      return r.depCount++, { type: q.AnimateChild, options: oi(e.options) };
    }
    visitAnimateRef(e, r) {
      return {
        type: q.AnimateRef,
        animation: this.visitReference(e.animation, r),
        options: oi(e.options),
      };
    }
    visitQuery(e, r) {
      let n = r.currentQuerySelector,
        i = e.options || {};
      r.queryCount++, (r.currentQuery = e);
      let [o, s] = NN(e.selector);
      (r.currentQuerySelector = n.length ? n + " " + o : o),
        Lt(r.collectedStyles, r.currentQuerySelector, new Map());
      let a = kt(this, ps(e.animation), r);
      return (
        (r.currentQuery = null),
        (r.currentQuerySelector = n),
        {
          type: q.Query,
          selector: o,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: s,
          animation: a,
          originalSelector: e.selector,
          options: oi(e.options),
        }
      );
    }
    visitStagger(e, r) {
      r.currentQuery || r.errors.push(JA());
      let n =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : Ac(e.timings, r.errors, !0);
      return {
        type: q.Stagger,
        animation: kt(this, ps(e.animation), r),
        timings: n,
        options: null,
      };
    }
  };
function NN(t) {
  let e = !!t.split(/\s*,\s*/).find((r) => r == Xw);
  return (
    e && (t = t.replace(AN, "")),
    (t = t
      .replace(/@\*/g, xc)
      .replace(/@\w+/g, (r) => xc + "-" + r.slice(1))
      .replace(/:animating/g, Jh)),
    [t, e]
  );
}
function ON(t) {
  return t ? I({}, t) : null;
}
var np = class {
  constructor(e) {
    (this.errors = e),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function PN(t) {
  if (typeof t == "string") return null;
  let e = null;
  if (Array.isArray(t))
    t.forEach((r) => {
      if (r instanceof Map && r.has("offset")) {
        let n = r;
        (e = parseFloat(n.get("offset"))), n.delete("offset");
      }
    });
  else if (t instanceof Map && t.has("offset")) {
    let r = t;
    (e = parseFloat(r.get("offset"))), r.delete("offset");
  }
  return e;
}
function RN(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let o = Ac(t, e).duration;
    return Gh(o, 0, "");
  }
  let r = t;
  if (r.split(/\s+/).some((o) => o.charAt(0) == "{" && o.charAt(1) == "{")) {
    let o = Gh(0, 0, "");
    return (o.dynamic = !0), (o.strValue = r), o;
  }
  let i = Ac(r, e);
  return Gh(i.duration, i.delay, i.easing);
}
function oi(t) {
  return (
    t ? ((t = I({}, t)), t.params && (t.params = ON(t.params))) : (t = {}), t
  );
}
function Gh(t, e, r) {
  return { duration: t, delay: e, easing: r };
}
function Dp(t, e, r, n, i, o, s = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: r,
    postStyleProps: n,
    duration: i,
    delay: o,
    totalTime: i + o,
    easing: s,
    subTimeline: a,
  };
}
var vs = class {
    constructor() {
      this._map = new Map();
    }
    get(e) {
      return this._map.get(e) || [];
    }
    append(e, r) {
      let n = this._map.get(e);
      n || this._map.set(e, (n = [])), n.push(...r);
    }
    has(e) {
      return this._map.has(e);
    }
    clear() {
      this._map.clear();
    }
  },
  FN = 1,
  kN = ":enter",
  LN = new RegExp(kN, "g"),
  VN = ":leave",
  jN = new RegExp(VN, "g");
function tb(t, e, r, n, i, o = new Map(), s = new Map(), a, l, c = []) {
  return new rp().buildKeyframes(t, e, r, n, i, o, s, a, l, c);
}
var rp = class {
    buildKeyframes(e, r, n, i, o, s, a, l, c, u = []) {
      c = c || new vs();
      let d = new ip(e, r, c, i, o, u, []);
      d.options = l;
      let p = l.delay ? Jn(l.delay) : 0;
      d.currentTimeline.delayNextStep(p),
        d.currentTimeline.setStyles([s], null, d.errors, l),
        kt(this, n, d);
      let g = d.timelines.filter((v) => v.containsAnimation());
      if (g.length && a.size) {
        let v;
        for (let S = g.length - 1; S >= 0; S--) {
          let x = g[S];
          if (x.element === r) {
            v = x;
            break;
          }
        }
        v &&
          !v.allowOnlyTimelineStyles() &&
          v.setStyles([a], null, d.errors, l);
      }
      return g.length
        ? g.map((v) => v.buildKeyframes())
        : [Dp(r, [], [], [], 0, p, "", !1)];
    }
    visitTrigger(e, r) {}
    visitState(e, r) {}
    visitTransition(e, r) {}
    visitAnimateChild(e, r) {
      let n = r.subInstructions.get(r.element);
      if (n) {
        let i = r.createSubContext(e.options),
          o = r.currentTimeline.currentTime,
          s = this._visitSubInstructions(n, i, i.options);
        o != s && r.transformIntoNewTimeline(s);
      }
      r.previousNode = e;
    }
    visitAnimateRef(e, r) {
      let n = r.createSubContext(e.options);
      n.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([e.options, e.animation.options], r, n),
        this.visitReference(e.animation, n),
        r.transformIntoNewTimeline(n.currentTimeline.currentTime),
        (r.previousNode = e);
    }
    _applyAnimationRefDelays(e, r, n) {
      for (let i of e) {
        let o = i?.delay;
        if (o) {
          let s =
            typeof o == "number" ? o : Jn(ms(o, i?.params ?? {}, r.errors));
          n.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(e, r, n) {
      let o = r.currentTimeline.currentTime,
        s = n.duration != null ? Jn(n.duration) : null,
        a = n.delay != null ? Jn(n.delay) : null;
      return (
        s !== 0 &&
          e.forEach((l) => {
            let c = r.appendInstructionToTimeline(l, s, a);
            o = Math.max(o, c.duration + c.delay);
          }),
        o
      );
    }
    visitReference(e, r) {
      r.updateOptions(e.options, !0),
        kt(this, e.animation, r),
        (r.previousNode = e);
    }
    visitSequence(e, r) {
      let n = r.subContextCount,
        i = r,
        o = e.options;
      if (
        o &&
        (o.params || o.delay) &&
        ((i = r.createSubContext(o)),
        i.transformIntoNewTimeline(),
        o.delay != null)
      ) {
        i.previousNode.type == q.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = Pc));
        let s = Jn(o.delay);
        i.delayNextStep(s);
      }
      e.steps.length &&
        (e.steps.forEach((s) => kt(this, s, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > n && i.transformIntoNewTimeline()),
        (r.previousNode = e);
    }
    visitGroup(e, r) {
      let n = [],
        i = r.currentTimeline.currentTime,
        o = e.options && e.options.delay ? Jn(e.options.delay) : 0;
      e.steps.forEach((s) => {
        let a = r.createSubContext(e.options);
        o && a.delayNextStep(o),
          kt(this, s, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          n.push(a.currentTimeline);
      }),
        n.forEach((s) => r.currentTimeline.mergeTimelineCollectedStyles(s)),
        r.transformIntoNewTimeline(i),
        (r.previousNode = e);
    }
    _visitTiming(e, r) {
      if (e.dynamic) {
        let n = e.strValue,
          i = r.params ? ms(n, r.params, r.errors) : n;
        return Ac(i, r.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, r) {
      let n = (r.currentAnimateTimings = this._visitTiming(e.timings, r)),
        i = r.currentTimeline;
      n.delay && (r.incrementTime(n.delay), i.snapshotCurrentStyles());
      let o = e.style;
      o.type == q.Keyframes
        ? this.visitKeyframes(o, r)
        : (r.incrementTime(n.duration),
          this.visitStyle(o, r),
          i.applyStylesToKeyframe()),
        (r.currentAnimateTimings = null),
        (r.previousNode = e);
    }
    visitStyle(e, r) {
      let n = r.currentTimeline,
        i = r.currentAnimateTimings;
      !i && n.hasCurrentStyleProperties() && n.forwardFrame();
      let o = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? n.applyEmptyStep(o)
        : n.setStyles(e.styles, o, r.errors, r.options),
        (r.previousNode = e);
    }
    visitKeyframes(e, r) {
      let n = r.currentAnimateTimings,
        i = r.currentTimeline.duration,
        o = n.duration,
        a = r.createSubContext().currentTimeline;
      (a.easing = n.easing),
        e.styles.forEach((l) => {
          let c = l.offset || 0;
          a.forwardTime(c * o),
            a.setStyles(l.styles, l.easing, r.errors, r.options),
            a.applyStylesToKeyframe();
        }),
        r.currentTimeline.mergeTimelineCollectedStyles(a),
        r.transformIntoNewTimeline(i + o),
        (r.previousNode = e);
    }
    visitQuery(e, r) {
      let n = r.currentTimeline.currentTime,
        i = e.options || {},
        o = i.delay ? Jn(i.delay) : 0;
      o &&
        (r.previousNode.type === q.Style ||
          (n == 0 && r.currentTimeline.hasCurrentStyleProperties())) &&
        (r.currentTimeline.snapshotCurrentStyles(), (r.previousNode = Pc));
      let s = n,
        a = r.invokeQuery(
          e.selector,
          e.originalSelector,
          e.limit,
          e.includeSelf,
          !!i.optional,
          r.errors
        );
      r.currentQueryTotal = a.length;
      let l = null;
      a.forEach((c, u) => {
        r.currentQueryIndex = u;
        let d = r.createSubContext(e.options, c);
        o && d.delayNextStep(o),
          c === r.element && (l = d.currentTimeline),
          kt(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let p = d.currentTimeline.currentTime;
        s = Math.max(s, p);
      }),
        (r.currentQueryIndex = 0),
        (r.currentQueryTotal = 0),
        r.transformIntoNewTimeline(s),
        l &&
          (r.currentTimeline.mergeTimelineCollectedStyles(l),
          r.currentTimeline.snapshotCurrentStyles()),
        (r.previousNode = e);
    }
    visitStagger(e, r) {
      let n = r.parentContext,
        i = r.currentTimeline,
        o = e.timings,
        s = Math.abs(o.duration),
        a = s * (r.currentQueryTotal - 1),
        l = s * r.currentQueryIndex;
      switch (o.duration < 0 ? "reverse" : o.easing) {
        case "reverse":
          l = a - l;
          break;
        case "full":
          l = n.currentStaggerTime;
          break;
      }
      let u = r.currentTimeline;
      l && u.delayNextStep(l);
      let d = u.currentTime;
      kt(this, e.animation, r),
        (r.previousNode = e),
        (n.currentStaggerTime =
          i.currentTime - d + (i.startTime - n.currentTimeline.startTime));
    }
  },
  Pc = {},
  ip = class t {
    constructor(e, r, n, i, o, s, a, l) {
      (this._driver = e),
        (this.element = r),
        (this.subInstructions = n),
        (this._enterClassName = i),
        (this._leaveClassName = o),
        (this.errors = s),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = Pc),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = l || new Rc(this._driver, r, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, r) {
      if (!e) return;
      let n = e,
        i = this.options;
      n.duration != null && (i.duration = Jn(n.duration)),
        n.delay != null && (i.delay = Jn(n.delay));
      let o = n.params;
      if (o) {
        let s = i.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!r || !s.hasOwnProperty(a)) && (s[a] = ms(o[a], s, this.errors));
          });
      }
    }
    _copyOptions() {
      let e = {};
      if (this.options) {
        let r = this.options.params;
        if (r) {
          let n = (e.params = {});
          Object.keys(r).forEach((i) => {
            n[i] = r[i];
          });
        }
      }
      return e;
    }
    createSubContext(e = null, r, n) {
      let i = r || this.element,
        o = new t(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, n || 0)
        );
      return (
        (o.previousNode = this.previousNode),
        (o.currentAnimateTimings = this.currentAnimateTimings),
        (o.options = this._copyOptions()),
        o.updateOptions(e),
        (o.currentQueryIndex = this.currentQueryIndex),
        (o.currentQueryTotal = this.currentQueryTotal),
        (o.parentContext = this),
        this.subContextCount++,
        o
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = Pc),
        (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(e, r, n) {
      let i = {
          duration: r ?? e.duration,
          delay: this.currentTimeline.currentTime + (n ?? 0) + e.delay,
          easing: "",
        },
        o = new op(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe
        );
      return this.timelines.push(o), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, r, n, i, o, s) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(LN, "." + this._enterClassName)),
          (e = e.replace(jN, "." + this._leaveClassName));
        let l = n != 1,
          c = this._driver.query(this.element, e, l);
        n !== 0 &&
          (c = n < 0 ? c.slice(c.length + n, c.length) : c.slice(0, n)),
          a.push(...c);
      }
      return !o && a.length == 0 && s.push(XA(r)), a;
    }
  },
  Rc = class t {
    constructor(e, r, n, i) {
      (this._driver = e),
        (this.element = r),
        (this.startTime = n),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(r)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(r, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(e) {
      let r = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || r
        ? (this.forwardTime(this.currentTime + e),
          r && this.snapshotCurrentStyles())
        : (this.startTime += e);
    }
    fork(e, r) {
      return (
        this.applyStylesToKeyframe(),
        new t(
          this._driver,
          e,
          r || this.currentTime,
          this._elementTimelineStylesLookup
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += FN), this._loadKeyframe();
    }
    forwardTime(e) {
      this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
    }
    _updateStyle(e, r) {
      this._localTimelineStyles.set(e, r),
        this._globalTimelineStyles.set(e, r),
        this._styleSummary.set(e, { time: this.currentTime, value: r });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(e) {
      e && this._previousKeyframe.set("easing", e);
      for (let [r, n] of this._globalTimelineStyles)
        this._backFill.set(r, n || Tn), this._currentKeyframe.set(r, Tn);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, r, n, i) {
      r && this._previousKeyframe.set("easing", r);
      let o = (i && i.params) || {},
        s = $N(e, this._globalTimelineStyles);
      for (let [a, l] of s) {
        let c = ms(l, o, n);
        this._pendingStyles.set(a, c),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Tn),
          this._updateStyle(a, c);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((e, r) => {
          this._currentKeyframe.set(r, e);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((e, r) => {
          this._currentKeyframe.has(r) || this._currentKeyframe.set(r, e);
        }));
    }
    snapshotCurrentStyles() {
      for (let [e, r] of this._localTimelineStyles)
        this._pendingStyles.set(e, r), this._updateStyle(e, r);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let e = [];
      for (let r in this._currentKeyframe) e.push(r);
      return e;
    }
    mergeTimelineCollectedStyles(e) {
      e._styleSummary.forEach((r, n) => {
        let i = this._styleSummary.get(n);
        (!i || r.time > i.time) && this._updateStyle(n, r.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let e = new Set(),
        r = new Set(),
        n = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, l) => {
        let c = new Map([...this._backFill, ...a]);
        c.forEach((u, d) => {
          u === _c ? e.add(d) : u === Tn && r.add(d);
        }),
          n || c.set("offset", l / this.duration),
          i.push(c);
      });
      let o = [...e.values()],
        s = [...r.values()];
      if (n) {
        let a = i[0],
          l = new Map(a);
        a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
      }
      return Dp(
        this.element,
        i,
        o,
        s,
        this.duration,
        this.startTime,
        this.easing,
        !1
      );
    }
  },
  op = class extends Rc {
    constructor(e, r, n, i, o, s, a = !1) {
      super(e, r, s.delay),
        (this.keyframes = n),
        (this.preStyleProps = i),
        (this.postStyleProps = o),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: s.duration,
          delay: s.delay,
          easing: s.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: r, duration: n, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && r) {
        let o = [],
          s = n + r,
          a = r / s,
          l = new Map(e[0]);
        l.set("offset", 0), o.push(l);
        let c = new Map(e[0]);
        c.set("offset", jw(a)), o.push(c);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let p = new Map(e[d]),
            g = p.get("offset"),
            v = r + g * n;
          p.set("offset", jw(v / s)), o.push(p);
        }
        (n = s), (r = 0), (i = ""), (e = o);
      }
      return Dp(
        this.element,
        e,
        this.preStyleProps,
        this.postStyleProps,
        n,
        r,
        i,
        !0
      );
    }
  };
function jw(t, e = 3) {
  let r = Math.pow(10, e - 1);
  return Math.round(t * r) / r;
}
function $N(t, e) {
  let r = new Map(),
    n;
  return (
    t.forEach((i) => {
      if (i === "*") {
        n ??= e.keys();
        for (let o of n) r.set(o, Tn);
      } else for (let [o, s] of i) r.set(o, s);
    }),
    r
  );
}
function $w(t, e, r, n, i, o, s, a, l, c, u, d, p) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: r,
    fromStyles: o,
    toState: n,
    toStyles: s,
    timelines: a,
    queriedElements: l,
    preStyleProps: c,
    postStyleProps: u,
    totalTime: d,
    errors: p,
  };
}
var Wh = {},
  Fc = class {
    constructor(e, r, n) {
      (this._triggerName = e), (this.ast = r), (this._stateStyles = n);
    }
    match(e, r, n, i) {
      return BN(this.ast.matchers, e, r, n, i);
    }
    buildStyles(e, r, n) {
      let i = this._stateStyles.get("*");
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(r, n) : new Map()
      );
    }
    build(e, r, n, i, o, s, a, l, c, u) {
      let d = [],
        p = (this.ast.options && this.ast.options.params) || Wh,
        g = (a && a.params) || Wh,
        v = this.buildStyles(n, g, d),
        S = (l && l.params) || Wh,
        x = this.buildStyles(i, S, d),
        T = new Set(),
        j = new Map(),
        ne = new Map(),
        $ = i === "void",
        ye = { params: nb(S, p), delay: this.ast.options?.delay },
        _e = u ? [] : tb(e, r, this.ast.animation, o, s, v, x, ye, c, d),
        Ee = 0;
      return (
        _e.forEach((rt) => {
          Ee = Math.max(rt.duration + rt.delay, Ee);
        }),
        d.length
          ? $w(r, this._triggerName, n, i, $, v, x, [], [], j, ne, Ee, d)
          : (_e.forEach((rt) => {
              let Pn = rt.element,
                di = Lt(j, Pn, new Set());
              rt.preStyleProps.forEach((xr) => di.add(xr));
              let Dg = Lt(ne, Pn, new Set());
              rt.postStyleProps.forEach((xr) => Dg.add(xr)),
                Pn !== r && T.add(Pn);
            }),
            $w(
              r,
              this._triggerName,
              n,
              i,
              $,
              v,
              x,
              _e,
              [...T.values()],
              j,
              ne,
              Ee
            ))
      );
    }
  };
function BN(t, e, r, n, i) {
  return t.some((o) => o(e, r, n, i));
}
function nb(t, e) {
  let r = I({}, e);
  return (
    Object.entries(t).forEach(([n, i]) => {
      i != null && (r[n] = i);
    }),
    r
  );
}
var sp = class {
  constructor(e, r, n) {
    (this.styles = e), (this.defaultParams = r), (this.normalizer = n);
  }
  buildStyles(e, r) {
    let n = new Map(),
      i = nb(e, this.defaultParams);
    return (
      this.styles.styles.forEach((o) => {
        typeof o != "string" &&
          o.forEach((s, a) => {
            s && (s = ms(s, i, r));
            let l = this.normalizer.normalizePropertyName(a, r);
            (s = this.normalizer.normalizeStyleValue(a, l, s, r)), n.set(a, s);
          });
      }),
      n
    );
  }
};
function UN(t, e, r) {
  return new ap(t, e, r);
}
var ap = class {
  constructor(e, r, n) {
    (this.name = e),
      (this.ast = r),
      (this._normalizer = n),
      (this.transitionFactories = []),
      (this.states = new Map()),
      r.states.forEach((i) => {
        let o = (i.options && i.options.params) || {};
        this.states.set(i.name, new sp(i.style, o, n));
      }),
      Bw(this.states, "true", "1"),
      Bw(this.states, "false", "0"),
      r.transitions.forEach((i) => {
        this.transitionFactories.push(new Fc(e, i, this.states));
      }),
      (this.fallbackTransition = HN(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, r, n, i) {
    return this.transitionFactories.find((s) => s.match(e, r, n, i)) || null;
  }
  matchStyles(e, r, n) {
    return this.fallbackTransition.buildStyles(e, r, n);
  }
};
function HN(t, e, r) {
  let n = [(s, a) => !0],
    i = { type: q.Sequence, steps: [], options: null },
    o = {
      type: q.Transition,
      animation: i,
      matchers: n,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new Fc(t, o, e);
}
function Bw(t, e, r) {
  t.has(e) ? t.has(r) || t.set(r, t.get(e)) : t.has(r) && t.set(e, t.get(r));
}
var zN = new vs(),
  lp = class {
    constructor(e, r, n) {
      (this.bodyNode = e),
        (this._driver = r),
        (this._normalizer = n),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(e, r) {
      let n = [],
        i = [],
        o = eb(this._driver, r, n, i);
      if (n.length) throw iN(n);
      i.length && void 0, this._animations.set(e, o);
    }
    _buildPlayer(e, r, n) {
      let i = e.element,
        o = Ww(this._normalizer, e.keyframes, r, n);
      return this._driver.animate(i, o, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, r, n = {}) {
      let i = [],
        o = this._animations.get(e),
        s,
        a = new Map();
      if (
        (o
          ? ((s = tb(
              this._driver,
              r,
              o,
              Zw,
              Zh,
              new Map(),
              new Map(),
              n,
              zN,
              i
            )),
            s.forEach((u) => {
              let d = Lt(a, u.element, new Map());
              u.postStyleProps.forEach((p) => d.set(p, null));
            }))
          : (i.push(oN()), (s = [])),
        i.length)
      )
        throw sN(i);
      a.forEach((u, d) => {
        u.forEach((p, g) => {
          u.set(g, this._driver.computeStyle(d, g, Tn));
        });
      });
      let l = s.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        c = br(l);
      return (
        this._playersById.set(e, c),
        c.onDestroy(() => this.destroy(e)),
        this.players.push(c),
        c
      );
    }
    destroy(e) {
      let r = this._getPlayer(e);
      r.destroy(), this._playersById.delete(e);
      let n = this.players.indexOf(r);
      n >= 0 && this.players.splice(n, 1);
    }
    _getPlayer(e) {
      let r = this._playersById.get(e);
      if (!r) throw aN(e);
      return r;
    }
    listen(e, r, n, i) {
      let o = pp(r, "", "", "");
      return hp(this._getPlayer(e), n, o, i), () => {};
    }
    command(e, r, n, i) {
      if (n == "register") {
        this.register(e, i[0]);
        return;
      }
      if (n == "create") {
        let s = i[0] || {};
        this.create(e, r, s);
        return;
      }
      let o = this._getPlayer(e);
      switch (n) {
        case "play":
          o.play();
          break;
        case "pause":
          o.pause();
          break;
        case "reset":
          o.reset();
          break;
        case "restart":
          o.restart();
          break;
        case "finish":
          o.finish();
          break;
        case "init":
          o.init();
          break;
        case "setPosition":
          o.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(e);
          break;
      }
    }
  },
  Uw = "ng-animate-queued",
  qN = ".ng-animate-queued",
  Qh = "ng-animate-disabled",
  GN = ".ng-animate-disabled",
  WN = "ng-star-inserted",
  QN = ".ng-star-inserted",
  KN = [],
  rb = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  YN = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  dn = "__ng_removed",
  ys = class {
    get params() {
      return this.options.params;
    }
    constructor(e, r = "") {
      this.namespaceId = r;
      let n = e && e.hasOwnProperty("value"),
        i = n ? e.value : e;
      if (((this.value = JN(i)), n)) {
        let o = e,
          { value: s } = o,
          a = qs(o, ["value"]);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(e) {
      let r = e.params;
      if (r) {
        let n = this.options.params;
        Object.keys(r).forEach((i) => {
          n[i] == null && (n[i] = r[i]);
        });
      }
    }
  },
  gs = "void",
  Kh = new ys(gs),
  cp = class {
    constructor(e, r, n) {
      (this.id = e),
        (this.hostElement = r),
        (this._engine = n),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        Wt(r, this._hostClassName);
    }
    listen(e, r, n, i) {
      if (!this._triggers.has(r)) throw lN(n, r);
      if (n == null || n.length == 0) throw cN(r);
      if (!XN(n)) throw uN(n, r);
      let o = Lt(this._elementListeners, e, []),
        s = { name: r, phase: n, callback: i };
      o.push(s);
      let a = Lt(this._engine.statesByElement, e, new Map());
      return (
        a.has(r) || (Wt(e, Ec), Wt(e, Ec + "-" + r), a.set(r, Kh)),
        () => {
          this._engine.afterFlush(() => {
            let l = o.indexOf(s);
            l >= 0 && o.splice(l, 1), this._triggers.has(r) || a.delete(r);
          });
        }
      );
    }
    register(e, r) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, r), !0);
    }
    _getTrigger(e) {
      let r = this._triggers.get(e);
      if (!r) throw dN(e);
      return r;
    }
    trigger(e, r, n, i = !0) {
      let o = this._getTrigger(r),
        s = new Ds(this.id, r, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (Wt(e, Ec),
        Wt(e, Ec + "-" + r),
        this._engine.statesByElement.set(e, (a = new Map())));
      let l = a.get(r),
        c = new ys(n, this.id);
      if (
        (!(n && n.hasOwnProperty("value")) && l && c.absorbOptions(l.options),
        a.set(r, c),
        l || (l = Kh),
        !(c.value === gs) && l.value === c.value)
      ) {
        if (!nO(l.params, c.params)) {
          let S = [],
            x = o.matchStyles(l.value, l.params, S),
            T = o.matchStyles(c.value, c.params, S);
          S.length
            ? this._engine.reportError(S)
            : this._engine.afterFlush(() => {
                si(e, x), xn(e, T);
              });
        }
        return;
      }
      let p = Lt(this._engine.playersByElement, e, []);
      p.forEach((S) => {
        S.namespaceId == this.id &&
          S.triggerName == r &&
          S.queued &&
          S.destroy();
      });
      let g = o.matchTransition(l.value, c.value, e, c.params),
        v = !1;
      if (!g) {
        if (!i) return;
        (g = o.fallbackTransition), (v = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: r,
          transition: g,
          fromState: l,
          toState: c,
          player: s,
          isFallbackTransition: v,
        }),
        v ||
          (Wt(e, Uw),
          s.onStart(() => {
            to(e, Uw);
          })),
        s.onDone(() => {
          let S = this.players.indexOf(s);
          S >= 0 && this.players.splice(S, 1);
          let x = this._engine.playersByElement.get(e);
          if (x) {
            let T = x.indexOf(s);
            T >= 0 && x.splice(T, 1);
          }
        }),
        this.players.push(s),
        p.push(s),
        s
      );
    }
    deregister(e) {
      this._triggers.delete(e),
        this._engine.statesByElement.forEach((r) => r.delete(e)),
        this._elementListeners.forEach((r, n) => {
          this._elementListeners.set(
            n,
            r.filter((i) => i.name != e)
          );
        });
    }
    clearElementCache(e) {
      this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
      let r = this._engine.playersByElement.get(e);
      r &&
        (r.forEach((n) => n.destroy()),
        this._engine.playersByElement.delete(e));
    }
    _signalRemovalForInnerTriggers(e, r) {
      let n = this._engine.driver.query(e, xc, !0);
      n.forEach((i) => {
        if (i[dn]) return;
        let o = this._engine.fetchNamespacesByElement(i);
        o.size
          ? o.forEach((s) => s.triggerLeaveAnimation(i, r, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          n.forEach((i) => this.clearElementCache(i))
        );
    }
    triggerLeaveAnimation(e, r, n, i) {
      let o = this._engine.statesByElement.get(e),
        s = new Map();
      if (o) {
        let a = [];
        if (
          (o.forEach((l, c) => {
            if ((s.set(c, l.value), this._triggers.has(c))) {
              let u = this.trigger(e, c, gs, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, r, s),
            n && br(a).onDone(() => this._engine.processLeaveNode(e)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(e) {
      let r = this._elementListeners.get(e),
        n = this._engine.statesByElement.get(e);
      if (r && n) {
        let i = new Set();
        r.forEach((o) => {
          let s = o.name;
          if (i.has(s)) return;
          i.add(s);
          let l = this._triggers.get(s).fallbackTransition,
            c = n.get(s) || Kh,
            u = new ys(gs),
            d = new Ds(this.id, s, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: s,
              transition: l,
              fromState: c,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(e, r) {
      let n = this._engine;
      if (
        (e.childElementCount && this._signalRemovalForInnerTriggers(e, r),
        this.triggerLeaveAnimation(e, r, !0))
      )
        return;
      let i = !1;
      if (n.totalAnimations) {
        let o = n.players.length ? n.playersByQueriedElement.get(e) : [];
        if (o && o.length) i = !0;
        else {
          let s = e;
          for (; (s = s.parentNode); )
            if (n.statesByElement.get(s)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        n.markElementAsRemoved(this.id, e, !1, r);
      else {
        let o = e[dn];
        (!o || o === rb) &&
          (n.afterFlush(() => this.clearElementCache(e)),
          n.destroyInnerAnimations(e),
          n._onRemovalComplete(e, r));
      }
    }
    insertNode(e, r) {
      Wt(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let r = [];
      return (
        this._queue.forEach((n) => {
          let i = n.player;
          if (i.destroyed) return;
          let o = n.element,
            s = this._elementListeners.get(o);
          s &&
            s.forEach((a) => {
              if (a.name == n.triggerName) {
                let l = pp(
                  o,
                  n.triggerName,
                  n.fromState.value,
                  n.toState.value
                );
                (l._data = e), hp(n.player, a.phase, l, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : r.push(n);
        }),
        (this._queue = []),
        r.sort((n, i) => {
          let o = n.transition.ast.depCount,
            s = i.transition.ast.depCount;
          return o == 0 || s == 0
            ? o - s
            : this._engine.driver.containsElement(n.element, i.element)
            ? 1
            : -1;
        })
      );
    }
    destroy(e) {
      this.players.forEach((r) => r.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, e);
    }
  },
  up = class {
    _onRemovalComplete(e, r) {
      this.onRemovalComplete(e, r);
    }
    constructor(e, r, n, i) {
      (this.bodyNode = e),
        (this.driver = r),
        (this._normalizer = n),
        (this.scheduler = i),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (o, s) => {});
    }
    get queuedPlayers() {
      let e = [];
      return (
        this._namespaceList.forEach((r) => {
          r.players.forEach((n) => {
            n.queued && e.push(n);
          });
        }),
        e
      );
    }
    createNamespace(e, r) {
      let n = new cp(e, r, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, r)
          ? this._balanceNamespaceList(n, r)
          : (this.newHostElements.set(r, n), this.collectEnterElement(r)),
        (this._namespaceLookup[e] = n)
      );
    }
    _balanceNamespaceList(e, r) {
      let n = this._namespaceList,
        i = this.namespacesByHostElement;
      if (n.length - 1 >= 0) {
        let s = !1,
          a = this.driver.getParentElement(r);
        for (; a; ) {
          let l = i.get(a);
          if (l) {
            let c = n.indexOf(l);
            n.splice(c + 1, 0, e), (s = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        s || n.unshift(e);
      } else n.push(e);
      return i.set(r, e), e;
    }
    register(e, r) {
      let n = this._namespaceLookup[e];
      return n || (n = this.createNamespace(e, r)), n;
    }
    registerTrigger(e, r, n) {
      let i = this._namespaceLookup[e];
      i && i.register(r, n) && this.totalAnimations++;
    }
    destroy(e, r) {
      e &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let n = this._fetchNamespace(e);
          this.namespacesByHostElement.delete(n.hostElement);
          let i = this._namespaceList.indexOf(n);
          i >= 0 && this._namespaceList.splice(i, 1),
            n.destroy(r),
            delete this._namespaceLookup[e];
        }));
    }
    _fetchNamespace(e) {
      return this._namespaceLookup[e];
    }
    fetchNamespacesByElement(e) {
      let r = new Set(),
        n = this.statesByElement.get(e);
      if (n) {
        for (let i of n.values())
          if (i.namespaceId) {
            let o = this._fetchNamespace(i.namespaceId);
            o && r.add(o);
          }
      }
      return r;
    }
    trigger(e, r, n, i) {
      if (Mc(r)) {
        let o = this._fetchNamespace(e);
        if (o) return o.trigger(r, n, i), !0;
      }
      return !1;
    }
    insertNode(e, r, n, i) {
      if (!Mc(r)) return;
      let o = r[dn];
      if (o && o.setForRemoval) {
        (o.setForRemoval = !1), (o.setForMove = !0);
        let s = this.collectedLeaveElements.indexOf(r);
        s >= 0 && this.collectedLeaveElements.splice(s, 1);
      }
      if (e) {
        let s = this._fetchNamespace(e);
        s && s.insertNode(r, n);
      }
      i && this.collectEnterElement(r);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, r) {
      r
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Wt(e, Qh))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), to(e, Qh));
    }
    removeNode(e, r, n) {
      if (Mc(r)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(r, n) : this.markElementAsRemoved(e, r, !1, n);
        let o = this.namespacesByHostElement.get(r);
        o && o.id !== e && o.removeNode(r, n);
      } else this._onRemovalComplete(r, n);
    }
    markElementAsRemoved(e, r, n, i, o) {
      this.collectedLeaveElements.push(r),
        (r[dn] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: n,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(e, r, n, i, o) {
      return Mc(r) ? this._fetchNamespace(e).listen(r, n, i, o) : () => {};
    }
    _buildInstruction(e, r, n, i, o) {
      return e.transition.build(
        this.driver,
        e.element,
        e.fromState.value,
        e.toState.value,
        n,
        i,
        e.fromState.options,
        e.toState.options,
        r,
        o
      );
    }
    destroyInnerAnimations(e) {
      let r = this.driver.query(e, xc, !0);
      r.forEach((n) => this.destroyActiveAnimationsForElement(n)),
        this.playersByQueriedElement.size != 0 &&
          ((r = this.driver.query(e, Jh, !0)),
          r.forEach((n) => this.finishActiveQueriedAnimationOnElement(n)));
    }
    destroyActiveAnimationsForElement(e) {
      let r = this.playersByElement.get(e);
      r &&
        r.forEach((n) => {
          n.queued ? (n.markedForDestroy = !0) : n.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(e) {
      let r = this.playersByQueriedElement.get(e);
      r && r.forEach((n) => n.finish());
    }
    whenRenderingDone() {
      return new Promise((e) => {
        if (this.players.length) return br(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let r = e[dn];
      if (r && r.setForRemoval) {
        if (((e[dn] = rb), r.namespaceId)) {
          this.destroyInnerAnimations(e);
          let n = this._fetchNamespace(r.namespaceId);
          n && n.clearElementCache(e);
        }
        this._onRemovalComplete(e, r.setForRemoval);
      }
      e.classList?.contains(Qh) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, GN, !0).forEach((n) => {
          this.markElementAsDisabled(n, !1);
        });
    }
    flush(e = -1) {
      let r = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((n, i) =>
            this._balanceNamespaceList(n, i)
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let n = 0; n < this.collectedEnterElements.length; n++) {
          let i = this.collectedEnterElements[n];
          Wt(i, WN);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let n = [];
        try {
          r = this._flushAnimations(n, e);
        } finally {
          for (let i = 0; i < n.length; i++) n[i]();
        }
      } else
        for (let n = 0; n < this.collectedLeaveElements.length; n++) {
          let i = this.collectedLeaveElements[n];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((n) => n()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let n = this._whenQuietFns;
        (this._whenQuietFns = []),
          r.length
            ? br(r).onDone(() => {
                n.forEach((i) => i());
              })
            : n.forEach((i) => i());
      }
    }
    reportError(e) {
      throw fN(e);
    }
    _flushAnimations(e, r) {
      let n = new vs(),
        i = [],
        o = new Map(),
        s = [],
        a = new Map(),
        l = new Map(),
        c = new Map(),
        u = new Set();
      this.disabledNodes.forEach((O) => {
        u.add(O);
        let R = this.driver.query(O, qN, !0);
        for (let V = 0; V < R.length; V++) u.add(R[V]);
      });
      let d = this.bodyNode,
        p = Array.from(this.statesByElement.keys()),
        g = qw(p, this.collectedEnterElements),
        v = new Map(),
        S = 0;
      g.forEach((O, R) => {
        let V = Zw + S++;
        v.set(R, V), O.forEach((X) => Wt(X, V));
      });
      let x = [],
        T = new Set(),
        j = new Set();
      for (let O = 0; O < this.collectedLeaveElements.length; O++) {
        let R = this.collectedLeaveElements[O],
          V = R[dn];
        V &&
          V.setForRemoval &&
          (x.push(R),
          T.add(R),
          V.hasAnimation
            ? this.driver.query(R, QN, !0).forEach((X) => T.add(X))
            : j.add(R));
      }
      let ne = new Map(),
        $ = qw(p, Array.from(T));
      $.forEach((O, R) => {
        let V = Zh + S++;
        ne.set(R, V), O.forEach((X) => Wt(X, V));
      }),
        e.push(() => {
          g.forEach((O, R) => {
            let V = v.get(R);
            O.forEach((X) => to(X, V));
          }),
            $.forEach((O, R) => {
              let V = ne.get(R);
              O.forEach((X) => to(X, V));
            }),
            x.forEach((O) => {
              this.processLeaveNode(O);
            });
        });
      let ye = [],
        _e = [];
      for (let O = this._namespaceList.length - 1; O >= 0; O--)
        this._namespaceList[O].drainQueuedTransitions(r).forEach((V) => {
          let X = V.player,
            Qe = V.element;
          if ((ye.push(X), this.collectedEnterElements.length)) {
            let it = Qe[dn];
            if (it && it.setForMove) {
              if (
                it.previousTriggersValues &&
                it.previousTriggersValues.has(V.triggerName)
              ) {
                let Ar = it.previousTriggersValues.get(V.triggerName),
                  jt = this.statesByElement.get(V.element);
                if (jt && jt.has(V.triggerName)) {
                  let Hs = jt.get(V.triggerName);
                  (Hs.value = Ar), jt.set(V.triggerName, Hs);
                }
              }
              X.destroy();
              return;
            }
          }
          let pn = !d || !this.driver.containsElement(d, Qe),
            Tt = ne.get(Qe),
            er = v.get(Qe),
            Se = this._buildInstruction(V, n, er, Tt, pn);
          if (Se.errors && Se.errors.length) {
            _e.push(Se);
            return;
          }
          if (pn) {
            X.onStart(() => si(Qe, Se.fromStyles)),
              X.onDestroy(() => xn(Qe, Se.toStyles)),
              i.push(X);
            return;
          }
          if (V.isFallbackTransition) {
            X.onStart(() => si(Qe, Se.fromStyles)),
              X.onDestroy(() => xn(Qe, Se.toStyles)),
              i.push(X);
            return;
          }
          let Cg = [];
          Se.timelines.forEach((it) => {
            (it.stretchStartingKeyframe = !0),
              this.disabledNodes.has(it.element) || Cg.push(it);
          }),
            (Se.timelines = Cg),
            n.append(Qe, Se.timelines);
          let EC = { instruction: Se, player: X, element: Qe };
          s.push(EC),
            Se.queriedElements.forEach((it) => Lt(a, it, []).push(X)),
            Se.preStyleProps.forEach((it, Ar) => {
              if (it.size) {
                let jt = l.get(Ar);
                jt || l.set(Ar, (jt = new Set())),
                  it.forEach((Hs, du) => jt.add(du));
              }
            }),
            Se.postStyleProps.forEach((it, Ar) => {
              let jt = c.get(Ar);
              jt || c.set(Ar, (jt = new Set())),
                it.forEach((Hs, du) => jt.add(du));
            });
        });
      if (_e.length) {
        let O = [];
        _e.forEach((R) => {
          O.push(hN(R.triggerName, R.errors));
        }),
          ye.forEach((R) => R.destroy()),
          this.reportError(O);
      }
      let Ee = new Map(),
        rt = new Map();
      s.forEach((O) => {
        let R = O.element;
        n.has(R) &&
          (rt.set(R, R),
          this._beforeAnimationBuild(O.player.namespaceId, O.instruction, Ee));
      }),
        i.forEach((O) => {
          let R = O.element;
          this._getPreviousPlayers(
            R,
            !1,
            O.namespaceId,
            O.triggerName,
            null
          ).forEach((X) => {
            Lt(Ee, R, []).push(X), X.destroy();
          });
        });
      let Pn = x.filter((O) => Gw(O, l, c)),
        di = new Map();
      zw(di, this.driver, j, c, Tn).forEach((O) => {
        Gw(O, l, c) && Pn.push(O);
      });
      let xr = new Map();
      g.forEach((O, R) => {
        zw(xr, this.driver, new Set(O), l, _c);
      }),
        Pn.forEach((O) => {
          let R = di.get(O),
            V = xr.get(O);
          di.set(
            O,
            new Map([...(R?.entries() ?? []), ...(V?.entries() ?? [])])
          );
        });
      let uu = [],
        wg = [],
        bg = {};
      s.forEach((O) => {
        let { element: R, player: V, instruction: X } = O;
        if (n.has(R)) {
          if (u.has(R)) {
            V.onDestroy(() => xn(R, X.toStyles)),
              (V.disabled = !0),
              V.overrideTotalTime(X.totalTime),
              i.push(V);
            return;
          }
          let Qe = bg;
          if (rt.size > 1) {
            let Tt = R,
              er = [];
            for (; (Tt = Tt.parentNode); ) {
              let Se = rt.get(Tt);
              if (Se) {
                Qe = Se;
                break;
              }
              er.push(Tt);
            }
            er.forEach((Se) => rt.set(Se, Qe));
          }
          let pn = this._buildAnimation(V.namespaceId, X, Ee, o, xr, di);
          if ((V.setRealPlayer(pn), Qe === bg)) uu.push(V);
          else {
            let Tt = this.playersByElement.get(Qe);
            Tt && Tt.length && (V.parentPlayer = br(Tt)), i.push(V);
          }
        } else
          si(R, X.fromStyles),
            V.onDestroy(() => xn(R, X.toStyles)),
            wg.push(V),
            u.has(R) && i.push(V);
      }),
        wg.forEach((O) => {
          let R = o.get(O.element);
          if (R && R.length) {
            let V = br(R);
            O.setRealPlayer(V);
          }
        }),
        i.forEach((O) => {
          O.parentPlayer ? O.syncPlayerEvents(O.parentPlayer) : O.destroy();
        });
      for (let O = 0; O < x.length; O++) {
        let R = x[O],
          V = R[dn];
        if ((to(R, Zh), V && V.hasAnimation)) continue;
        let X = [];
        if (a.size) {
          let pn = a.get(R);
          pn && pn.length && X.push(...pn);
          let Tt = this.driver.query(R, Jh, !0);
          for (let er = 0; er < Tt.length; er++) {
            let Se = a.get(Tt[er]);
            Se && Se.length && X.push(...Se);
          }
        }
        let Qe = X.filter((pn) => !pn.destroyed);
        Qe.length ? eO(this, R, Qe) : this.processLeaveNode(R);
      }
      return (
        (x.length = 0),
        uu.forEach((O) => {
          this.players.push(O),
            O.onDone(() => {
              O.destroy();
              let R = this.players.indexOf(O);
              this.players.splice(R, 1);
            }),
            O.play();
        }),
        uu
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, r, n, i, o) {
      let s = [];
      if (r) {
        let a = this.playersByQueriedElement.get(e);
        a && (s = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let l = !o || o == gs;
          a.forEach((c) => {
            c.queued || (!l && c.triggerName != i) || s.push(c);
          });
        }
      }
      return (
        (n || i) &&
          (s = s.filter(
            (a) => !((n && n != a.namespaceId) || (i && i != a.triggerName))
          )),
        s
      );
    }
    _beforeAnimationBuild(e, r, n) {
      let i = r.triggerName,
        o = r.element,
        s = r.isRemovalTransition ? void 0 : e,
        a = r.isRemovalTransition ? void 0 : i;
      for (let l of r.timelines) {
        let c = l.element,
          u = c !== o,
          d = Lt(n, c, []);
        this._getPreviousPlayers(c, u, s, a, r.toState).forEach((g) => {
          let v = g.getRealPlayer();
          v.beforeDestroy && v.beforeDestroy(), g.destroy(), d.push(g);
        });
      }
      si(o, r.fromStyles);
    }
    _buildAnimation(e, r, n, i, o, s) {
      let a = r.triggerName,
        l = r.element,
        c = [],
        u = new Set(),
        d = new Set(),
        p = r.timelines.map((v) => {
          let S = v.element;
          u.add(S);
          let x = S[dn];
          if (x && x.removedBeforeQueried) return new wr(v.duration, v.delay);
          let T = S !== l,
            j = tO((n.get(S) || KN).map((Ee) => Ee.getRealPlayer())).filter(
              (Ee) => {
                let rt = Ee;
                return rt.element ? rt.element === S : !1;
              }
            ),
            ne = o.get(S),
            $ = s.get(S),
            ye = Ww(this._normalizer, v.keyframes, ne, $),
            _e = this._buildPlayer(v, ye, j);
          if ((v.subTimeline && i && d.add(S), T)) {
            let Ee = new Ds(e, a, S);
            Ee.setRealPlayer(_e), c.push(Ee);
          }
          return _e;
        });
      c.forEach((v) => {
        Lt(this.playersByQueriedElement, v.element, []).push(v),
          v.onDone(() => ZN(this.playersByQueriedElement, v.element, v));
      }),
        u.forEach((v) => Wt(v, kw));
      let g = br(p);
      return (
        g.onDestroy(() => {
          u.forEach((v) => to(v, kw)), xn(l, r.toStyles);
        }),
        d.forEach((v) => {
          Lt(i, v, []).push(g);
        }),
        g
      );
    }
    _buildPlayer(e, r, n) {
      return r.length > 0
        ? this.driver.animate(e.element, r, e.duration, e.delay, e.easing, n)
        : new wr(e.duration, e.delay);
    }
  },
  Ds = class {
    constructor(e, r, n) {
      (this.namespaceId = e),
        (this.triggerName = r),
        (this.element = n),
        (this._player = new wr()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(e) {
      this._containsRealPlayer ||
        ((this._player = e),
        this._queuedCallbacks.forEach((r, n) => {
          r.forEach((i) => hp(e, n, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(e.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(e) {
      this.totalTime = e;
    }
    syncPlayerEvents(e) {
      let r = this._player;
      r.triggerCallback && e.onStart(() => r.triggerCallback("start")),
        e.onDone(() => this.finish()),
        e.onDestroy(() => this.destroy());
    }
    _queueEvent(e, r) {
      Lt(this._queuedCallbacks, e, []).push(r);
    }
    onDone(e) {
      this.queued && this._queueEvent("done", e), this._player.onDone(e);
    }
    onStart(e) {
      this.queued && this._queueEvent("start", e), this._player.onStart(e);
    }
    onDestroy(e) {
      this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(e) {
      this.queued || this._player.setPosition(e);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(e) {
      let r = this._player;
      r.triggerCallback && r.triggerCallback(e);
    }
  };
function ZN(t, e, r) {
  let n = t.get(e);
  if (n) {
    if (n.length) {
      let i = n.indexOf(r);
      n.splice(i, 1);
    }
    n.length == 0 && t.delete(e);
  }
  return n;
}
function JN(t) {
  return t ?? null;
}
function Mc(t) {
  return t && t.nodeType === 1;
}
function XN(t) {
  return t == "start" || t == "done";
}
function Hw(t, e) {
  let r = t.style.display;
  return (t.style.display = e ?? "none"), r;
}
function zw(t, e, r, n, i) {
  let o = [];
  r.forEach((l) => o.push(Hw(l)));
  let s = [];
  n.forEach((l, c) => {
    let u = new Map();
    l.forEach((d) => {
      let p = e.computeStyle(c, d, i);
      u.set(d, p), (!p || p.length == 0) && ((c[dn] = YN), s.push(c));
    }),
      t.set(c, u);
  });
  let a = 0;
  return r.forEach((l) => Hw(l, o[a++])), s;
}
function qw(t, e) {
  let r = new Map();
  if ((t.forEach((a) => r.set(a, [])), e.length == 0)) return r;
  let n = 1,
    i = new Set(e),
    o = new Map();
  function s(a) {
    if (!a) return n;
    let l = o.get(a);
    if (l) return l;
    let c = a.parentNode;
    return r.has(c) ? (l = c) : i.has(c) ? (l = n) : (l = s(c)), o.set(a, l), l;
  }
  return (
    e.forEach((a) => {
      let l = s(a);
      l !== n && r.get(l).push(a);
    }),
    r
  );
}
function Wt(t, e) {
  t.classList?.add(e);
}
function to(t, e) {
  t.classList?.remove(e);
}
function eO(t, e, r) {
  br(r).onDone(() => t.processLeaveNode(e));
}
function tO(t) {
  let e = [];
  return ib(t, e), e;
}
function ib(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    n instanceof hs ? ib(n.players, e) : e.push(n);
  }
}
function nO(t, e) {
  let r = Object.keys(t),
    n = Object.keys(e);
  if (r.length != n.length) return !1;
  for (let i = 0; i < r.length; i++) {
    let o = r[i];
    if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1;
  }
  return !0;
}
function Gw(t, e, r) {
  let n = r.get(t);
  if (!n) return !1;
  let i = e.get(t);
  return i ? n.forEach((o) => i.add(o)) : e.set(t, n), r.delete(t), !0;
}
var ro = class {
  constructor(e, r, n, i) {
    (this._driver = r),
      (this._normalizer = n),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (o, s) => {}),
      (this._transitionEngine = new up(e.body, r, n, i)),
      (this._timelineEngine = new lp(e.body, r, n)),
      (this._transitionEngine.onRemovalComplete = (o, s) =>
        this.onRemovalComplete(o, s));
  }
  registerTrigger(e, r, n, i, o) {
    let s = e + "-" + i,
      a = this._triggerCache[s];
    if (!a) {
      let l = [],
        c = [],
        u = eb(this._driver, o, l, c);
      if (l.length) throw nN(i, l);
      c.length && void 0,
        (a = UN(i, u, this._normalizer)),
        (this._triggerCache[s] = a);
    }
    this._transitionEngine.registerTrigger(r, i, a);
  }
  register(e, r) {
    this._transitionEngine.register(e, r);
  }
  destroy(e, r) {
    this._transitionEngine.destroy(e, r);
  }
  onInsert(e, r, n, i) {
    this._transitionEngine.insertNode(e, r, n, i);
  }
  onRemove(e, r, n) {
    this._transitionEngine.removeNode(e, r, n);
  }
  disableAnimations(e, r) {
    this._transitionEngine.markElementAsDisabled(e, r);
  }
  process(e, r, n, i) {
    if (n.charAt(0) == "@") {
      let [o, s] = Rw(n),
        a = i;
      this._timelineEngine.command(o, r, s, a);
    } else this._transitionEngine.trigger(e, r, n, i);
  }
  listen(e, r, n, i, o) {
    if (n.charAt(0) == "@") {
      let [s, a] = Rw(n);
      return this._timelineEngine.listen(s, r, a, o);
    }
    return this._transitionEngine.listen(e, r, n, i, o);
  }
  flush(e = -1) {
    this._transitionEngine.flush(e);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(e) {
    this._transitionEngine.afterFlushAnimationsDone(e);
  }
};
function rO(t, e) {
  let r = null,
    n = null;
  return (
    Array.isArray(e) && e.length
      ? ((r = Yh(e[0])), e.length > 1 && (n = Yh(e[e.length - 1])))
      : e instanceof Map && (r = Yh(e)),
    r || n ? new dp(t, r, n) : null
  );
}
var no = class no {
  constructor(e, r, n) {
    (this._element = e),
      (this._startStyles = r),
      (this._endStyles = n),
      (this._state = 0);
    let i = no.initialStylesByElement.get(e);
    i || no.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        xn(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (xn(this._element, this._initialStyles),
        this._endStyles &&
          (xn(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (no.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (si(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (si(this._element, this._endStyles), (this._endStyles = null)),
        xn(this._element, this._initialStyles),
        (this._state = 3));
  }
};
no.initialStylesByElement = new WeakMap();
var dp = no;
function Yh(t) {
  let e = null;
  return (
    t.forEach((r, n) => {
      iO(n) && ((e = e || new Map()), e.set(n, r));
    }),
    e
  );
}
function iO(t) {
  return t === "display" || t === "position";
}
var kc = class {
    constructor(e, r, n, i) {
      (this.element = e),
        (this.keyframes = r),
        (this.options = n),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = n.duration),
        (this._delay = n.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let e = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        e,
        this.options
      )),
        (this._finalKeyframe = e.length ? e[e.length - 1] : new Map());
      let r = () => this._onFinish();
      this.domPlayer.addEventListener("finish", r),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", r);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(e) {
      let r = [];
      return (
        e.forEach((n) => {
          r.push(Object.fromEntries(n));
        }),
        r
      );
    }
    _triggerWebAnimation(e, r, n) {
      return e.animate(this._convertKeyframesToObject(r), n);
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((e) => e()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    setPosition(e) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = e * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let e = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((n, i) => {
          i !== "offset" && e.set(i, this._finished ? n : yp(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let r = e === "start" ? this._onStartFns : this._onDoneFns;
      r.forEach((n) => n()), (r.length = 0);
    }
  },
  Lc = class {
    validateStyleProperty(e) {
      return !0;
    }
    validateAnimatableStyleProperty(e) {
      return !0;
    }
    matchesElement(e, r) {
      return !1;
    }
    containsElement(e, r) {
      return Qw(e, r);
    }
    getParentElement(e) {
      return gp(e);
    }
    query(e, r, n) {
      return Kw(e, r, n);
    }
    computeStyle(e, r, n) {
      return yp(e, r);
    }
    animate(e, r, n, i, o, s = []) {
      let a = i == 0 ? "both" : "forwards",
        l = { duration: n, delay: i, fill: a };
      o && (l.easing = o);
      let c = new Map(),
        u = s.filter((g) => g instanceof kc);
      EN(n, i) &&
        u.forEach((g) => {
          g.currentSnapshot.forEach((v, S) => c.set(S, v));
        });
      let d = bN(r).map((g) => new Map(g));
      d = SN(e, d, c);
      let p = rO(e, d);
      return new kc(e, d, l, p);
    }
  };
var Tc = "@",
  ob = "@.disabled",
  Vc = class {
    constructor(e, r, n, i) {
      (this.namespaceId = e),
        (this.delegate = r),
        (this.engine = n),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(e) {
      this.delegate.destroyNode?.(e);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(e, r) {
      return this.delegate.createElement(e, r);
    }
    createComment(e) {
      return this.delegate.createComment(e);
    }
    createText(e) {
      return this.delegate.createText(e);
    }
    appendChild(e, r) {
      this.delegate.appendChild(e, r),
        this.engine.onInsert(this.namespaceId, r, e, !1);
    }
    insertBefore(e, r, n, i = !0) {
      this.delegate.insertBefore(e, r, n),
        this.engine.onInsert(this.namespaceId, r, e, i);
    }
    removeChild(e, r, n) {
      this.engine.onRemove(this.namespaceId, r, this.delegate);
    }
    selectRootElement(e, r) {
      return this.delegate.selectRootElement(e, r);
    }
    parentNode(e) {
      return this.delegate.parentNode(e);
    }
    nextSibling(e) {
      return this.delegate.nextSibling(e);
    }
    setAttribute(e, r, n, i) {
      this.delegate.setAttribute(e, r, n, i);
    }
    removeAttribute(e, r, n) {
      this.delegate.removeAttribute(e, r, n);
    }
    addClass(e, r) {
      this.delegate.addClass(e, r);
    }
    removeClass(e, r) {
      this.delegate.removeClass(e, r);
    }
    setStyle(e, r, n, i) {
      this.delegate.setStyle(e, r, n, i);
    }
    removeStyle(e, r, n) {
      this.delegate.removeStyle(e, r, n);
    }
    setProperty(e, r, n) {
      r.charAt(0) == Tc && r == ob
        ? this.disableAnimations(e, !!n)
        : this.delegate.setProperty(e, r, n);
    }
    setValue(e, r) {
      this.delegate.setValue(e, r);
    }
    listen(e, r, n) {
      return this.delegate.listen(e, r, n);
    }
    disableAnimations(e, r) {
      this.engine.disableAnimations(e, r);
    }
  },
  fp = class extends Vc {
    constructor(e, r, n, i, o) {
      super(r, n, i, o), (this.factory = e), (this.namespaceId = r);
    }
    setProperty(e, r, n) {
      r.charAt(0) == Tc
        ? r.charAt(1) == "." && r == ob
          ? ((n = n === void 0 ? !0 : !!n), this.disableAnimations(e, n))
          : this.engine.process(this.namespaceId, e, r.slice(1), n)
        : this.delegate.setProperty(e, r, n);
    }
    listen(e, r, n) {
      if (r.charAt(0) == Tc) {
        let i = oO(e),
          o = r.slice(1),
          s = "";
        return (
          o.charAt(0) != Tc && ([o, s] = sO(o)),
          this.engine.listen(this.namespaceId, i, o, s, (a) => {
            let l = a._data || -1;
            this.factory.scheduleListenerCallback(l, n, a);
          })
        );
      }
      return this.delegate.listen(e, r, n);
    }
  };
function oO(t) {
  switch (t) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return t;
  }
}
function sO(t) {
  let e = t.indexOf("."),
    r = t.substring(0, e),
    n = t.slice(e + 1);
  return [r, n];
}
var jc = class {
  constructor(e, r, n) {
    (this.delegate = e),
      (this.engine = r),
      (this._zone = n),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (r.onRemovalComplete = (i, o) => {
        let s = o?.parentNode(i);
        s && o.removeChild(s, i);
      });
  }
  createRenderer(e, r) {
    let n = "",
      i = this.delegate.createRenderer(e, r);
    if (!e || !r?.data?.animation) {
      let c = this._rendererCache,
        u = c.get(i);
      if (!u) {
        let d = () => c.delete(i);
        (u = new Vc(n, i, this.engine, d)), c.set(i, u);
      }
      return u;
    }
    let o = r.id,
      s = r.id + "-" + this._currentId;
    this._currentId++, this.engine.register(s, e);
    let a = (c) => {
      Array.isArray(c)
        ? c.forEach(a)
        : this.engine.registerTrigger(o, s, e, c.name, c);
    };
    return r.data.animation.forEach(a), new fp(this, s, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(e, r, n) {
    if (e >= 0 && e < this._microtaskId) {
      this._zone.run(() => r(n));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((o) => {
            let [s, a] = o;
            s(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([r, n]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var lO = (() => {
  let e = class e extends ro {
    constructor(n, i, o) {
      super(n, i, o, C(Po, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(Ce), w(ai), w(li));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function cO() {
  return new Nc();
}
function uO(t, e, r) {
  return new jc(t, e, r);
}
var ab = [
    { provide: li, useFactory: cO },
    { provide: ro, useClass: lO },
    { provide: Gr, useFactory: uO, deps: [cc, ro, ee] },
  ],
  sb = [
    { provide: ai, useFactory: () => new Lc() },
    { provide: pf, useValue: "BrowserAnimations" },
    ...ab,
  ],
  dO = [
    { provide: ai, useClass: mp },
    { provide: pf, useValue: "NoopAnimations" },
    ...ab,
  ],
  lb = (() => {
    let e = class e {
      static withConfig(n) {
        return { ngModule: e, providers: n.disableAnimations ? dO : sb };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({ providers: sb, imports: [dc] }));
    let t = e;
    return t;
  })();
var G = "primary",
  Rs = Symbol("RouteTitle"),
  Sp = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function lo(t) {
  return new Sp(t);
}
function fO(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function hO(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!An(t[r], e[r])) return !1;
  return !0;
}
function An(t, e) {
  let r = t ? Ip(t) : void 0,
    n = e ? Ip(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !vb(t[i], e[i]))) return !1;
  return !0;
}
function Ip(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function vb(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function yb(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Sr(t) {
  return xu(t) ? t : ei(t) ? se(Promise.resolve(t)) : P(t);
}
var pO = { exact: wb, subset: bb },
  Db = { exact: gO, subset: mO, ignored: () => !0 };
function cb(t, e, r) {
  return (
    pO[r.paths](t.root, e.root, r.matrixParams) &&
    Db[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function gO(t, e) {
  return An(t, e);
}
function wb(t, e, r) {
  if (
    !ui(t.segments, e.segments) ||
    !Uc(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !wb(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function mO(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => vb(t[r], e[r]))
  );
}
function bb(t, e, r) {
  return Cb(t, e, e.segments, r);
}
function Cb(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!ui(i, r) || e.hasChildren() || !Uc(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!ui(t.segments, r) || !Uc(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !bb(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !ui(t.segments, i) || !Uc(t.segments, i, n) || !t.children[G]
      ? !1
      : Cb(t.children[G], e, o, n);
  }
}
function Uc(t, e, r) {
  return e.every((n, i) => Db[r](t[i].parameters, n.parameters));
}
var Cr = class {
    constructor(e = new le([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= lo(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return DO.serialize(this);
    }
  },
  le = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Hc(this);
    }
  },
  ci = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= lo(this.parameters)), this._parameterMap;
    }
    toString() {
      return Eb(this);
    }
  };
function vO(t, e) {
  return ui(t, e) && t.every((r, n) => An(r.parameters, e[n].parameters));
}
function ui(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function yO(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === G && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== G && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var Fs = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => new Is(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Is = class {
    parse(e) {
      let r = new Tp(e);
      return new Cr(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${ws(e.root, !0)}`,
        n = CO(e.queryParams),
        i = typeof e.fragment == "string" ? `#${wO(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  DO = new Is();
function Hc(t) {
  return t.segments.map((e) => Eb(e)).join("/");
}
function ws(t, e) {
  if (!t.hasChildren()) return Hc(t);
  if (e) {
    let r = t.children[G] ? ws(t.children[G], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== G && n.push(`${i}:${ws(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = yO(t, (n, i) =>
      i === G ? [ws(t.children[G], !1)] : [`${i}:${ws(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[G] != null
      ? `${Hc(t)}/${r[0]}`
      : `${Hc(t)}/(${r.join("//")})`;
  }
}
function _b(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function $c(t) {
  return _b(t).replace(/%3B/gi, ";");
}
function wO(t) {
  return encodeURI(t);
}
function Mp(t) {
  return _b(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function zc(t) {
  return decodeURIComponent(t);
}
function ub(t) {
  return zc(t.replace(/\+/g, "%20"));
}
function Eb(t) {
  return `${Mp(t.path)}${bO(t.parameters)}`;
}
function bO(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${Mp(e)}=${Mp(r)}`)
    .join("");
}
function CO(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${$c(r)}=${$c(i)}`).join("&")
        : `${$c(r)}=${$c(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var _O = /^[^\/()?;#]+/;
function bp(t) {
  let e = t.match(_O);
  return e ? e[0] : "";
}
var EO = /^[^\/()?;=#]+/;
function SO(t) {
  let e = t.match(EO);
  return e ? e[0] : "";
}
var IO = /^[^=?&#]+/;
function MO(t) {
  let e = t.match(IO);
  return e ? e[0] : "";
}
var TO = /^[^&#]+/;
function xO(t) {
  let e = t.match(TO);
  return e ? e[0] : "";
}
var Tp = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new le([], {})
        : new le([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[G] = new le(e, r)),
      n
    );
  }
  parseSegment() {
    let e = bp(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new b(4009, !1);
    return this.capture(e), new ci(zc(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = SO(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = bp(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[zc(r)] = zc(n);
  }
  parseQueryParam(e) {
    let r = MO(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = xO(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = ub(r),
      o = ub(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = bp(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new b(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = G);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[G] : new le([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new b(4011, !1);
  }
};
function Sb(t) {
  return t.segments.length > 0 ? new le([], { [G]: t }) : t;
}
function Ib(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Ib(i);
    if (n === G && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new le(t.segments, e);
  return AO(r);
}
function AO(t) {
  if (t.numberOfChildren === 1 && t.children[G]) {
    let e = t.children[G];
    return new le(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function co(t) {
  return t instanceof Cr;
}
function NO(t, e, r = null, n = null) {
  let i = Mb(t);
  return Tb(i, e, r, n);
}
function Mb(t) {
  let e;
  function r(o) {
    let s = {};
    for (let l of o.children) {
      let c = r(l);
      s[l.outlet] = c;
    }
    let a = new le(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = Sb(n);
  return e ?? i;
}
function Tb(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Cp(i, i, i, r, n);
  let o = OO(e);
  if (o.toRoot()) return Cp(i, i, new le([], {}), r, n);
  let s = PO(o, i, t),
    a = s.processChildren
      ? _s(s.segmentGroup, s.index, o.commands)
      : Ab(s.segmentGroup, s.index, o.commands);
  return Cp(i, s.segmentGroup, a, r, n);
}
function qc(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Ms(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Cp(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([l, c]) => {
      o[l] = Array.isArray(c) ? c.map((u) => `${u}`) : `${c}`;
    });
  let s;
  t === e ? (s = r) : (s = xb(t, e, r));
  let a = Sb(Ib(s));
  return new Cr(a, o, i);
}
function xb(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = xb(o, e, r));
    }),
    new le(t.segments, n)
  );
}
var Gc = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && qc(n[0]))
    )
      throw new b(4003, !1);
    let i = n.find(Ms);
    if (i && i !== yb(n)) throw new b(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function OO(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Gc(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([l, c]) => {
              a[l] = typeof c == "string" ? c.split("/") : c;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, l) => {
            (l == 0 && a === ".") ||
              (l == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new Gc(r, e, n);
}
var so = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function PO(t, e, r) {
  if (t.isAbsolute) return new so(e, !0, 0);
  if (!r) return new so(e, !1, NaN);
  if (r.parent === null) return new so(r, !0, 0);
  let n = qc(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return RO(r, i, t.numberOfDoubleDots);
}
function RO(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new b(4005, !1);
    i = n.segments.length;
  }
  return new so(n, !1, i - o);
}
function FO(t) {
  return Ms(t[0]) ? t[0].outlets : { [G]: t };
}
function Ab(t, e, r) {
  if (((t ??= new le([], {})), t.segments.length === 0 && t.hasChildren()))
    return _s(t, e, r);
  let n = kO(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new le(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[G] = new le(t.segments.slice(n.pathIndex), t.children)),
      _s(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new le(t.segments, {})
      : n.match && !t.hasChildren()
      ? xp(t, e, r)
      : n.match
      ? _s(t, 0, i)
      : xp(t, e, r);
}
function _s(t, e, r) {
  if (r.length === 0) return new le(t.segments, {});
  {
    let n = FO(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== G) &&
      t.children[G] &&
      t.numberOfChildren === 1 &&
      t.children[G].segments.length === 0
    ) {
      let o = _s(t.children[G], e, r);
      return new le(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Ab(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new le(t.segments, i)
    );
  }
}
function kO(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (Ms(a)) break;
    let l = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && l === void 0) break;
    if (l && c && typeof c == "object" && c.outlets === void 0) {
      if (!fb(l, c, s)) return o;
      n += 2;
    } else {
      if (!fb(l, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function xp(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (Ms(o)) {
      let l = LO(o.outlets);
      return new le(n, l);
    }
    if (i === 0 && qc(r[0])) {
      let l = t.segments[e];
      n.push(new ci(l.path, db(r[0]))), i++;
      continue;
    }
    let s = Ms(o) ? o.outlets[G] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && qc(a)
      ? (n.push(new ci(s, db(a))), (i += 2))
      : (n.push(new ci(s, {})), i++);
  }
  return new le(n, {});
}
function LO(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = xp(new le([], {}), 0, n));
    }),
    e
  );
}
function db(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function fb(t, e, r) {
  return t == r.path && An(e, r.parameters);
}
var Es = "imperative",
  tt = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(tt || {}),
  Kt = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  uo = class extends Kt {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = tt.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  fn = class extends Kt {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = tt.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Qt = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Qt || {}),
  Wc = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(Wc || {}),
  _r = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = tt.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Er = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = tt.NavigationSkipped);
    }
  },
  Ts = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = tt.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Qc = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = tt.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ap = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = tt.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Np = class extends Kt {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = tt.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Op = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = tt.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Pp = class extends Kt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = tt.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Rp = class {
    constructor(e) {
      (this.route = e), (this.type = tt.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Fp = class {
    constructor(e) {
      (this.route = e), (this.type = tt.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  kp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = tt.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Lp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = tt.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Vp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = tt.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  jp = class {
    constructor(e) {
      (this.snapshot = e), (this.type = tt.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Kc = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = tt.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  xs = class {},
  As = class {
    constructor(e) {
      this.url = e;
    }
  };
var $p = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new ks()),
        (this.attachRef = null);
    }
  },
  ks = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new $p()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Yc = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = Bp(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = Bp(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = Up(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Up(e, this._root).map((r) => r.value);
    }
  };
function Bp(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = Bp(t, r);
    if (n) return n;
  }
  return null;
}
function Up(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = Up(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var Vt = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function oo(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Zc = class extends Yc {
  constructor(e, r) {
    super(e), (this.snapshot = r), Jp(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Nb(t) {
  let e = VO(t),
    r = new nt([new ci("", {})]),
    n = new nt({}),
    i = new nt({}),
    o = new nt({}),
    s = new nt(""),
    a = new We(r, n, o, s, i, G, t, e.root);
  return (a.snapshot = e.root), new Zc(new Vt(a, []), e);
}
function VO(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new Ns([], e, n, i, r, G, t, null, {});
  return new Jc("", new Vt(o, []));
}
var We = class {
  constructor(e, r, n, i, o, s, a, l) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(F((c) => c[Rs])) ?? P(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(F((e) => lo(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(F((e) => lo(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Zp(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: I(I({}, e.params), t.params),
          data: I(I({}, e.data), t.data),
          resolve: I(I(I(I({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: I({}, t.params),
          data: I({}, t.data),
          resolve: I(I({}, t.data), t._resolvedData ?? {}),
        }),
    i && Pb(i) && (n.resolve[Rs] = i.title),
    n
  );
}
var Ns = class {
    get title() {
      return this.data?.[Rs];
    }
    constructor(e, r, n, i, o, s, a, l, c) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = l),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= lo(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= lo(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  Jc = class extends Yc {
    constructor(e, r) {
      super(r), (this.url = e), Jp(this, r);
    }
    toString() {
      return Ob(this._root);
    }
  };
function Jp(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => Jp(t, r));
}
function Ob(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Ob).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function _p(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      An(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      An(e.params, r.params) || t.paramsSubject.next(r.params),
      hO(e.url, r.url) || t.urlSubject.next(r.url),
      An(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Hp(t, e) {
  let r = An(t.params, e.params) && vO(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Hp(t.parent, e.parent));
}
function Pb(t) {
  return typeof t.title == "string" || t.title === null;
}
var Xp = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = G),
          (this.activateEvents = new ae()),
          (this.deactivateEvents = new ae()),
          (this.attachEvents = new ae()),
          (this.detachEvents = new ae()),
          (this.parentContexts = C(ks)),
          (this.location = C(zn)),
          (this.changeDetector = C(En)),
          (this.environmentInjector = C(ut)),
          (this.inputBinder = C(ru, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new b(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new b(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new b(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new b(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          l = this.parentContexts.getOrCreateContext(this.name).children,
          c = new zp(n, l, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Dt],
      }));
    let t = e;
    return t;
  })(),
  zp = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === We
        ? this.route
        : e === ks
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  ru = new A(""),
  hb = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          o = Do([i.queryParams, i.params, i.data])
            .pipe(
              je(
                ([s, a, l], c) => (
                  (l = I(I(I({}, s), a), l)),
                  c === 0 ? P(l) : Promise.resolve(l)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = Y0(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: l } of a.inputs)
                n.activatedComponentRef.setInput(l, s[l]);
            });
        this.outletDataSubscriptions.set(n, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function jO(t, e, r) {
  let n = Os(t, e._root, r ? r._root : void 0);
  return new Zc(n, e);
}
function Os(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = $O(t, e, r);
    return new Vt(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => Os(t, a))),
          s
        );
      }
    }
    let n = BO(e.value),
      i = e.children.map((o) => Os(t, o));
    return new Vt(n, i);
  }
}
function $O(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return Os(t, n, i);
    return Os(t, n);
  });
}
function BO(t) {
  return new We(
    new nt(t.url),
    new nt(t.params),
    new nt(t.queryParams),
    new nt(t.fragment),
    new nt(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Rb = "ngNavigationCancelingError";
function Fb(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = co(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = kb(!1, Qt.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function kb(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`);
  return (r[Rb] = !0), (r.cancellationCode = e), r;
}
function UO(t) {
  return Lb(t) && co(t.url);
}
function Lb(t) {
  return !!t && t[Rb];
}
var HO = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [N0],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && E(0, "router-outlet");
      },
      dependencies: [Xp],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function zO(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = Nl(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function eg(t) {
  let e = t.children && t.children.map(eg),
    r = e ? te(I({}, t), { children: e }) : I({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== G &&
      (r.component = HO),
    r
  );
}
function Nn(t) {
  return t.outlet || G;
}
function qO(t, e) {
  let r = t.filter((n) => Nn(n) === e);
  return r.push(...t.filter((n) => Nn(n) !== e)), r;
}
function Ls(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var GO = (t, e, r, n) =>
    F(
      (i) => (
        new qp(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  qp = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        _p(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = oo(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = oo(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = oo(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = oo(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new jp(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Lp(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((_p(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            _p(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Ls(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  Xc = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  ao = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function WO(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return bs(n, i, r, [n.value]);
}
function QO(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function ho(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Pv(t) ? t : e.get(t)) : n;
}
function bs(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = oo(e);
  return (
    t.children.forEach((s) => {
      KO(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Ss(a, r.getContext(s), i)),
    i
  );
}
function KO(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let l = YO(s, o, o.routeConfig.runGuardsAndResolvers);
    l
      ? i.canActivateChecks.push(new Xc(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? bs(t, e, a ? a.children : null, n, i) : bs(t, e, r, n, i),
      l &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new ao(a.outlet.component, s));
  } else
    s && Ss(e, a, i),
      i.canActivateChecks.push(new Xc(n)),
      o.component
        ? bs(t, null, a ? a.children : null, n, i)
        : bs(t, null, r, n, i);
  return i;
}
function YO(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !ui(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !ui(t.url, e.url) || !An(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Hp(t, e) || !An(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Hp(t, e);
  }
}
function Ss(t, e, r) {
  let n = oo(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? Ss(s, e.children.getContext(o), r)
        : Ss(s, null, r)
      : Ss(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new ao(e.outlet.component, i))
        : r.canDeactivateChecks.push(new ao(null, i))
      : r.canDeactivateChecks.push(new ao(null, i));
}
function Vs(t) {
  return typeof t == "function";
}
function ZO(t) {
  return typeof t == "boolean";
}
function JO(t) {
  return t && Vs(t.canLoad);
}
function XO(t) {
  return t && Vs(t.canActivate);
}
function eP(t) {
  return t && Vs(t.canActivateChild);
}
function tP(t) {
  return t && Vs(t.canDeactivate);
}
function nP(t) {
  return t && Vs(t.canMatch);
}
function Vb(t) {
  return t instanceof Rn || t?.name === "EmptyError";
}
var Bc = Symbol("INITIAL_VALUE");
function fo() {
  return je((t) =>
    Do(t.map((e) => e.pipe(at(1), ku(Bc)))).pipe(
      F((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === Bc) return Bc;
            if (r === !1 || r instanceof Cr) return r;
          }
        return !0;
      }),
      Oe((e) => e !== Bc),
      at(1)
    )
  );
}
function rP(t, e) {
  return we((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? P(te(I({}, r), { guardsResult: !0 }))
      : iP(s, n, i, t).pipe(
          we((a) => (a && ZO(a) ? oP(n, o, t, e) : P(a))),
          F((a) => te(I({}, r), { guardsResult: a }))
        );
  });
}
function iP(t, e, r, n) {
  return se(t).pipe(
    we((i) => uP(i.component, i.route, r, e, n)),
    Ve((i) => i !== !0, !0)
  );
}
function oP(t, e, r, n) {
  return se(e).pipe(
    Fn((i) =>
      tr(
        aP(i.route.parent, n),
        sP(i.route, n),
        cP(t, i.path, r),
        lP(t, i.route, r)
      )
    ),
    Ve((i) => i !== !0, !0)
  );
}
function sP(t, e) {
  return t !== null && e && e(new Vp(t)), P(!0);
}
function aP(t, e) {
  return t !== null && e && e(new kp(t)), P(!0);
}
function lP(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return P(!0);
  let i = n.map((o) =>
    ma(() => {
      let s = Ls(e) ?? r,
        a = ho(o, s),
        l = XO(a) ? a.canActivate(e, t) : _n(s, () => a(e, t));
      return Sr(l).pipe(Ve());
    })
  );
  return P(i).pipe(fo());
}
function cP(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => QO(s))
      .filter((s) => s !== null)
      .map((s) =>
        ma(() => {
          let a = s.guards.map((l) => {
            let c = Ls(s.node) ?? r,
              u = ho(l, c),
              d = eP(u) ? u.canActivateChild(n, t) : _n(c, () => u(n, t));
            return Sr(d).pipe(Ve());
          });
          return P(a).pipe(fo());
        })
      );
  return P(o).pipe(fo());
}
function uP(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return P(!0);
  let s = o.map((a) => {
    let l = Ls(e) ?? i,
      c = ho(a, l),
      u = tP(c) ? c.canDeactivate(t, e, r, n) : _n(l, () => c(t, e, r, n));
    return Sr(u).pipe(Ve());
  });
  return P(s).pipe(fo());
}
function dP(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return P(!0);
  let o = i.map((s) => {
    let a = ho(s, t),
      l = JO(a) ? a.canLoad(e, r) : _n(t, () => a(e, r));
    return Sr(l);
  });
  return P(o).pipe(fo(), jb(n));
}
function jb(t) {
  return Cu(
    N((e) => {
      if (co(e)) throw Fb(t, e);
    }),
    F((e) => e === !0)
  );
}
function fP(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return P(!0);
  let o = i.map((s) => {
    let a = ho(s, t),
      l = nP(a) ? a.canMatch(e, r) : _n(t, () => a(e, r));
    return Sr(l);
  });
  return P(o).pipe(fo(), jb(n));
}
var Ps = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  eu = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function io(t) {
  return Ke(new Ps(t));
}
function hP(t) {
  return Ke(new b(4e3, !1));
}
function pP(t) {
  return Ke(kb(!1, Qt.GuardRejected));
}
var Gp = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return P(n);
        if (i.numberOfChildren > 1 || !i.children[G]) return hP(e.redirectTo);
        i = i.children[G];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new eu(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new Cr(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, l]) => {
          s[a] = this.createSegmentGroup(e, l, n, i);
        }),
        new le(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new b(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  Wp = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function gP(t, e, r, n, i) {
  let o = tg(t, e, r);
  return o.matched
    ? ((n = zO(e, n)),
      fP(n, e, r, i).pipe(F((s) => (s === !0 ? o : I({}, Wp)))))
    : P(o);
}
function tg(t, e, r) {
  if (e.path === "**") return mP(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? I({}, Wp)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || fO)(r, t, e);
  if (!i) return I({}, Wp);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
    o[a] = l.path;
  });
  let s =
    i.consumed.length > 0
      ? I(I({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function mP(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? yb(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function pb(t, e, r, n) {
  return r.length > 0 && DP(t, r, n)
    ? {
        segmentGroup: new le(e, yP(n, new le(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && wP(t, r, n)
    ? {
        segmentGroup: new le(t.segments, vP(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new le(t.segments, t.children), slicedSegments: r };
}
function vP(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (iu(t, e, o) && !n[Nn(o)]) {
      let s = new le([], {});
      i[Nn(o)] = s;
    }
  return I(I({}, n), i);
}
function yP(t, e) {
  let r = {};
  r[G] = e;
  for (let n of t)
    if (n.path === "" && Nn(n) !== G) {
      let i = new le([], {});
      r[Nn(n)] = i;
    }
  return r;
}
function DP(t, e, r) {
  return r.some((n) => iu(t, e, n) && Nn(n) !== G);
}
function wP(t, e, r) {
  return r.some((n) => iu(t, e, n));
}
function iu(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function bP(t, e, r, n) {
  return Nn(t) !== n && (n === G || !iu(e, r, t)) ? !1 : tg(e, t, r).matched;
}
function CP(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var Qp = class {};
function _P(t, e, r, n, i, o, s = "emptyOnly") {
  return new Kp(t, e, r, n, i, s, o).recognize();
}
var EP = 31,
  Kp = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Gp(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new b(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = pb(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        F((r) => {
          let n = new Ns(
              [],
              Object.freeze({}),
              Object.freeze(I({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              G,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Vt(n, r),
            o = new Jc("", i),
            s = NO(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, G).pipe(
        ge((n) => {
          if (n instanceof eu)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof Ps ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = Zp(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            F((o) => (o instanceof Vt ? [o] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return se(i).pipe(
        Fn((o) => {
          let s = n.children[o],
            a = qO(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        Fu((o, s) => (o.push(...s), o)),
        nr(null),
        Ru(),
        we((o) => {
          if (o === null) return io(n);
          let s = $b(o);
          return SP(s), P(s);
        })
      );
    }
    processSegment(e, r, n, i, o, s) {
      return se(r).pipe(
        Fn((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            ge((l) => {
              if (l instanceof Ps) return P(null);
              throw l;
            })
          )
        ),
        Ve((a) => !!a),
        ge((a) => {
          if (Vb(a)) return CP(n, i, o) ? P(new Qp()) : io(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return bP(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
          : io(i)
        : io(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: l,
        positionalParamSegments: c,
        remainingSegments: u,
      } = tg(r, i, o);
      if (!a) return io(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > EP && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(l, i.redirectTo, c);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(we((p) => this.processSegment(e, n, r, p.concat(u), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s = gP(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          je((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  je(({ routes: l }) => {
                    let c = n._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: p,
                      } = a,
                      g = new Ns(
                        u,
                        p,
                        Object.freeze(I({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        MP(n),
                        Nn(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        TP(n)
                      ),
                      { segmentGroup: v, slicedSegments: S } = pb(r, u, d, l);
                    if (S.length === 0 && v.hasChildren())
                      return this.processChildren(c, l, v).pipe(
                        F((T) => (T === null ? null : new Vt(g, T)))
                      );
                    if (l.length === 0 && S.length === 0)
                      return P(new Vt(g, []));
                    let x = Nn(n) === o;
                    return this.processSegment(c, l, v, S, x ? G : o, !0).pipe(
                      F((T) => new Vt(g, T instanceof Vt ? [T] : []))
                    );
                  })
                ))
              : io(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? P({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? P({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : dP(e, r, n, this.urlSerializer).pipe(
              we((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      N((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : pP(r)
              )
            )
        : P({ routes: [], injector: e });
    }
  };
function SP(t) {
  t.sort((e, r) =>
    e.value.outlet === G
      ? -1
      : r.value.outlet === G
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function IP(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function $b(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!IP(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = $b(n.children);
    e.push(new Vt(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function MP(t) {
  return t.data || {};
}
function TP(t) {
  return t.resolve || {};
}
function xP(t, e, r, n, i, o) {
  return we((s) =>
    _P(t, e, r, n, s.extractedUrl, i, o).pipe(
      F(({ state: a, tree: l }) =>
        te(I({}, s), { targetSnapshot: a, urlAfterRedirects: l })
      )
    )
  );
}
function AP(t, e) {
  return we((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return P(r);
    let o = new Set(i.map((l) => l.route)),
      s = new Set();
    for (let l of o) if (!s.has(l)) for (let c of Bb(l)) s.add(c);
    let a = 0;
    return se(s).pipe(
      Fn((l) =>
        o.has(l)
          ? NP(l, n, t, e)
          : ((l.data = Zp(l, l.parent, t).resolve), P(void 0))
      ),
      N(() => a++),
      Ci(1),
      we((l) => (a === s.size ? P(r) : gt))
    );
  });
}
function Bb(t) {
  let e = t.children.map((r) => Bb(r)).flat();
  return [t, ...e];
}
function NP(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Pb(i) && (o[Rs] = i.title),
    OP(o, t, e, n).pipe(
      F(
        (s) => (
          (t._resolvedData = s), (t.data = Zp(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function OP(t, e, r, n) {
  let i = Ip(t);
  if (i.length === 0) return P({});
  let o = {};
  return se(i).pipe(
    we((s) =>
      PP(t[s], e, r, n).pipe(
        Ve(),
        N((a) => {
          o[s] = a;
        })
      )
    ),
    Ci(1),
    bo(o),
    ge((s) => (Vb(s) ? gt : Ke(s)))
  );
}
function PP(t, e, r, n) {
  let i = Ls(e) ?? n,
    o = ho(t, i),
    s = o.resolve ? o.resolve(e, r) : _n(i, () => o(e, r));
  return Sr(s);
}
function Ep(t) {
  return je((e) => {
    let r = t(e);
    return r ? se(r).pipe(F(() => e)) : P(e);
  });
}
var Ub = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === G));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Rs];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => C(RP), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  RP = (() => {
    let e = class e extends Ub {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(GD));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  js = new A("", { providedIn: "root", factory: () => ({}) }),
  tu = new A(""),
  ng = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = C(Ul));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return P(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = Sr(n.loadComponent()).pipe(
            F(Hb),
            N((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            rr(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new yi(i, () => new ce()).pipe(vi());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return P({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = FP(i, this.compiler, n, this.onLoadEndListener).pipe(
            rr(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new yi(s, () => new ce()).pipe(vi());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function FP(t, e, r, n) {
  return Sr(t.loadChildren()).pipe(
    F(Hb),
    we((i) =>
      i instanceof Ro || Array.isArray(i) ? P(i) : se(e.compileModuleAsync(i))
    ),
    F((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(tu, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(eg), injector: o }
      );
    })
  );
}
function kP(t) {
  return t && typeof t == "object" && "default" in t;
}
function Hb(t) {
  return kP(t) ? t.default : t;
}
var rg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => C(LP), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  LP = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  zb = new A(""),
  qb = new A("");
function VP(t, e, r) {
  let n = t.get(qb),
    i = t.get(Ce);
  return t.get(ee).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), Promise.resolve();
    let o,
      s = new Promise((c) => {
        o = c;
      }),
      a = i.startViewTransition(() => (o(), jP(t))),
      { onViewTransitionCreated: l } = n;
    return l && _n(t, () => l({ transition: a, from: e, to: r })), s;
  });
}
function jP(t) {
  return new Promise((e) => {
    Uf(e, { injector: t });
  });
}
var ig = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new ce()),
        (this.transitionAbortSubject = new ce()),
        (this.configLoader = C(ng)),
        (this.environmentInjector = C(ut)),
        (this.urlSerializer = C(Fs)),
        (this.rootContexts = C(ks)),
        (this.location = C(zi)),
        (this.inputBindingEnabled = C(ru, { optional: !0 }) !== null),
        (this.titleStrategy = C(Ub)),
        (this.options = C(js, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = C(rg)),
        (this.createViewTransition = C(zb, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => P(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new Rp(o)),
        i = (o) => this.events.next(new Fp(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(
        te(I(I({}, this.transitions.value), n), { id: i })
      );
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new nt({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: Es,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          Oe((s) => s.id !== 0),
          F((s) =>
            te(I({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          je((s) => {
            this.currentTransition = s;
            let a = !1,
              l = !1;
            return P(s).pipe(
              N((c) => {
                this.currentNavigation = {
                  id: c.id,
                  initialUrl: c.rawUrl,
                  extractedUrl: c.extractedUrl,
                  trigger: c.source,
                  extras: c.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? te(I({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              je((c) => {
                let u =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!u && d !== "reload") {
                  let p = "";
                  return (
                    this.events.next(
                      new Er(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        p,
                        Wc.IgnoredSameUrlNavigation
                      )
                    ),
                    c.resolve(null),
                    gt
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return P(c).pipe(
                    je((p) => {
                      let g = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new uo(
                            p.id,
                            this.urlSerializer.serialize(p.extractedUrl),
                            p.source,
                            p.restoredState
                          )
                        ),
                        g !== this.transitions?.getValue()
                          ? gt
                          : Promise.resolve(p)
                      );
                    }),
                    xP(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    N((p) => {
                      (s.targetSnapshot = p.targetSnapshot),
                        (s.urlAfterRedirects = p.urlAfterRedirects),
                        (this.currentNavigation = te(
                          I({}, this.currentNavigation),
                          { finalUrl: p.urlAfterRedirects }
                        ));
                      let g = new Qc(
                        p.id,
                        this.urlSerializer.serialize(p.extractedUrl),
                        this.urlSerializer.serialize(p.urlAfterRedirects),
                        p.targetSnapshot
                      );
                      this.events.next(g);
                    })
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: p,
                      extractedUrl: g,
                      source: v,
                      restoredState: S,
                      extras: x,
                    } = c,
                    T = new uo(p, this.urlSerializer.serialize(g), v, S);
                  this.events.next(T);
                  let j = Nb(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      te(I({}, c), {
                        targetSnapshot: j,
                        urlAfterRedirects: g,
                        extras: te(I({}, x), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = g),
                    P(s)
                  );
                } else {
                  let p = "";
                  return (
                    this.events.next(
                      new Er(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        p,
                        Wc.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    c.resolve(null),
                    gt
                  );
                }
              }),
              N((c) => {
                let u = new Ap(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot
                );
                this.events.next(u);
              }),
              F(
                (c) => (
                  (this.currentTransition = s =
                    te(I({}, c), {
                      guards: WO(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              rP(this.environmentInjector, (c) => this.events.next(c)),
              N((c) => {
                if (((s.guardsResult = c.guardsResult), co(c.guardsResult)))
                  throw Fb(this.urlSerializer, c.guardsResult);
                let u = new Np(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult
                );
                this.events.next(u);
              }),
              Oe((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, "", Qt.GuardRejected),
                    !1)
              ),
              Ep((c) => {
                if (c.guards.canActivateChecks.length)
                  return P(c).pipe(
                    N((u) => {
                      let d = new Op(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    je((u) => {
                      let d = !1;
                      return P(u).pipe(
                        AP(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        N({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                u,
                                "",
                                Qt.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    N((u) => {
                      let d = new Pp(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              Ep((c) => {
                let u = (d) => {
                  let p = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    p.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        N((g) => {
                          d.component = g;
                        }),
                        F(() => {})
                      )
                    );
                  for (let g of d.children) p.push(...u(g));
                  return p;
                };
                return Do(u(c.targetSnapshot.root)).pipe(nr(null), at(1));
              }),
              Ep(() => this.afterPreactivation()),
              je(() => {
                let { currentSnapshot: c, targetSnapshot: u } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    u.root
                  );
                return d ? se(d).pipe(F(() => s)) : P(s);
              }),
              F((c) => {
                let u = jO(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    te(I({}, c), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  s
                );
              }),
              N(() => {
                this.events.next(new xs());
              }),
              GO(
                this.rootContexts,
                n.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled
              ),
              at(1),
              N({
                next: (c) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new fn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot
                    ),
                    c.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Lu(
                this.transitionAbortSubject.pipe(
                  N((c) => {
                    throw c;
                  })
                )
              ),
              rr(() => {
                !a &&
                  !l &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Qt.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              ge((c) => {
                if (((l = !0), Lb(c)))
                  this.events.next(
                    new _r(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode
                    )
                  ),
                    UO(c) ? this.events.next(new As(c.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Ts(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(c));
                  } catch (u) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(u);
                  }
                }
                return gt;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new _r(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function $P(t) {
  return t !== Es;
}
var BP = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => C(UP), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Yp = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  UP = (() => {
    let e = class e extends Yp {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = fr(e)))(o || e);
      };
    })()),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Gb = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: () => C(HP), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  HP = (() => {
    let e = class e extends Gb {
      constructor() {
        super(...arguments),
          (this.location = C(zi)),
          (this.urlSerializer = C(Fs)),
          (this.options = C(js, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = C(rg)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Cr()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Nb(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof uo) this.stateMemento = this.createStateMemento();
        else if (n instanceof Er) this.rawUrlTree = i.initialUrl;
        else if (n instanceof Qc) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof xs
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof _r &&
              (n.code === Qt.GuardRejected || n.code === Qt.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof Ts
            ? this.restoreHistory(i, !0)
            : n instanceof fn &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = I(I({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = I(
            I({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = fr(e)))(o || e);
      };
    })()),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Cs = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(Cs || {});
function Wb(t, e) {
  t.events
    .pipe(
      Oe(
        (r) =>
          r instanceof fn ||
          r instanceof _r ||
          r instanceof Ts ||
          r instanceof Er
      ),
      F((r) =>
        r instanceof fn || r instanceof Er
          ? Cs.COMPLETE
          : (
              r instanceof _r
                ? r.code === Qt.Redirect ||
                  r.code === Qt.SupersededByNewNavigation
                : !1
            )
          ? Cs.REDIRECTING
          : Cs.FAILED
      ),
      Oe((r) => r !== Cs.REDIRECTING),
      at(1)
    )
    .subscribe(() => {
      e();
    });
}
function zP(t) {
  throw t;
}
var qP = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  GP = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  De = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = C(Vl)),
          (this.stateManager = C(Gb)),
          (this.options = C(js, { optional: !0 }) || {}),
          (this.pendingTasks = C(Xr)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = C(ig)),
          (this.urlSerializer = C(Fs)),
          (this.location = C(zi)),
          (this.urlHandlingStrategy = C(rg)),
          (this._events = new ce()),
          (this.errorHandler = this.options.errorHandler || zP),
          (this.navigated = !1),
          (this.routeReuseStrategy = C(BP)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = C(tu, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!C(ru, { optional: !0 })),
          (this.eventsSubscription = new Ne()),
          (this.isNgZoneEnabled = C(ee) instanceof ee && ee.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof _r &&
                  i.code !== Qt.Redirect &&
                  i.code !== Qt.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof fn) this.navigated = !0;
              else if (i instanceof As) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  l = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || $P(o.source),
                  };
                this.scheduleNavigation(a, Es, null, l, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            QP(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Es,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let c = I({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let l = this.parseUrl(n);
        this.scheduleNavigation(l, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(eg)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: l,
            preserveFragment: c,
          } = i,
          u = c ? this.currentUrlTree.fragment : a,
          d = null;
        switch (l) {
          case "merge":
            d = I(I({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let p;
        try {
          let g = o ? o.snapshot : this.routerState.snapshot.root;
          p = Mb(g);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (p = this.currentUrlTree.root);
        }
        return Tb(p, n, d, u ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = co(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, Es, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return WP(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = I({}, qP)) : i === !1 ? (o = I({}, GP)) : (o = i),
          co(n))
        )
          return cb(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return cb(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let l, c, u;
        a
          ? ((l = a.resolve), (c = a.reject), (u = a.promise))
          : (u = new Promise((p, g) => {
              (l = p), (c = g);
            }));
        let d = this.pendingTasks.add();
        return (
          Wb(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: l,
            reject: c,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((p) => Promise.reject(p))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function WP(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new b(4008, !1);
}
function QP(t) {
  return !(t instanceof xs) && !(t instanceof As);
}
var et = (() => {
    let e = class e {
      constructor(n, i, o, s, a, l) {
        (this.router = n),
          (this.route = i),
          (this.tabIndexAttribute = o),
          (this.renderer = s),
          (this.el = a),
          (this.locationStrategy = l),
          (this.href = null),
          (this.commands = null),
          (this.onChanges = new ce()),
          (this.preserveFragment = !1),
          (this.skipLocationChange = !1),
          (this.replaceUrl = !1);
        let c = a.nativeElement.tagName?.toLowerCase();
        (this.isAnchorElement = c === "a" || c === "area"),
          this.isAnchorElement
            ? (this.subscription = n.events.subscribe((u) => {
                u instanceof fn && this.updateHref();
              }))
            : this.setTabIndexIfNotOnNativeEl("0");
      }
      setTabIndexIfNotOnNativeEl(n) {
        this.tabIndexAttribute != null ||
          this.isAnchorElement ||
          this.applyAttributeValue("tabindex", n);
      }
      ngOnChanges(n) {
        this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
      }
      set routerLink(n) {
        n != null
          ? ((this.commands = Array.isArray(n) ? n : [n]),
            this.setTabIndexIfNotOnNativeEl("0"))
          : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
      }
      onClick(n, i, o, s, a) {
        let l = this.urlTree;
        if (
          l === null ||
          (this.isAnchorElement &&
            (n !== 0 ||
              i ||
              o ||
              s ||
              a ||
              (typeof this.target == "string" && this.target != "_self")))
        )
          return !0;
        let c = {
          skipLocationChange: this.skipLocationChange,
          replaceUrl: this.replaceUrl,
          state: this.state,
          info: this.info,
        };
        return this.router.navigateByUrl(l, c), !this.isAnchorElement;
      }
      ngOnDestroy() {
        this.subscription?.unsubscribe();
      }
      updateHref() {
        let n = this.urlTree;
        this.href =
          n !== null && this.locationStrategy
            ? this.locationStrategy?.prepareExternalUrl(
                this.router.serializeUrl(n)
              )
            : null;
        let i =
          this.href === null
            ? null
            : Ey(
                this.href,
                this.el.nativeElement.tagName.toLowerCase(),
                "href"
              );
        this.applyAttributeValue("href", i);
      }
      applyAttributeValue(n, i) {
        let o = this.renderer,
          s = this.el.nativeElement;
        i !== null ? o.setAttribute(s, n, i) : o.removeAttribute(s, n);
      }
      get urlTree() {
        return this.commands === null
          ? null
          : this.router.createUrlTree(this.commands, {
              relativeTo:
                this.relativeTo !== void 0 ? this.relativeTo : this.route,
              queryParams: this.queryParams,
              fragment: this.fragment,
              queryParamsHandling: this.queryParamsHandling,
              preserveFragment: this.preserveFragment,
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(De), y(We), Dl("tabindex"), y(bt), y(He), y(In));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "routerLink", ""]],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 1 &&
            U("click", function (a) {
              return o.onClick(
                a.button,
                a.ctrlKey,
                a.shiftKey,
                a.altKey,
                a.metaKey
              );
            }),
            i & 2 && hr("target", o.target);
        },
        inputs: {
          target: "target",
          queryParams: "queryParams",
          fragment: "fragment",
          queryParamsHandling: "queryParamsHandling",
          state: "state",
          info: "info",
          relativeTo: "relativeTo",
          preserveFragment: [
            Re.HasDecoratorInputTransform,
            "preserveFragment",
            "preserveFragment",
            pr,
          ],
          skipLocationChange: [
            Re.HasDecoratorInputTransform,
            "skipLocationChange",
            "skipLocationChange",
            pr,
          ],
          replaceUrl: [
            Re.HasDecoratorInputTransform,
            "replaceUrl",
            "replaceUrl",
            pr,
          ],
          routerLink: "routerLink",
        },
        standalone: !0,
        features: [Gf, Dt],
      }));
    let t = e;
    return t;
  })(),
  Qb = (() => {
    let e = class e {
      get isActive() {
        return this._isActive;
      }
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.element = i),
          (this.renderer = o),
          (this.cdr = s),
          (this.link = a),
          (this.classes = []),
          (this._isActive = !1),
          (this.routerLinkActiveOptions = { exact: !1 }),
          (this.isActiveChange = new ae()),
          (this.routerEventsSubscription = n.events.subscribe((l) => {
            l instanceof fn && this.update();
          }));
      }
      ngAfterContentInit() {
        P(this.links.changes, P(null))
          .pipe(mn())
          .subscribe((n) => {
            this.update(), this.subscribeToEachLinkOnChanges();
          });
      }
      subscribeToEachLinkOnChanges() {
        this.linkInputChangesSubscription?.unsubscribe();
        let n = [...this.links.toArray(), this.link]
          .filter((i) => !!i)
          .map((i) => i.onChanges);
        this.linkInputChangesSubscription = se(n)
          .pipe(mn())
          .subscribe((i) => {
            this._isActive !== this.isLinkActive(this.router)(i) &&
              this.update();
          });
      }
      set routerLinkActive(n) {
        let i = Array.isArray(n) ? n : n.split(" ");
        this.classes = i.filter((o) => !!o);
      }
      ngOnChanges(n) {
        this.update();
      }
      ngOnDestroy() {
        this.routerEventsSubscription.unsubscribe(),
          this.linkInputChangesSubscription?.unsubscribe();
      }
      update() {
        !this.links ||
          !this.router.navigated ||
          queueMicrotask(() => {
            let n = this.hasActiveLinks();
            this._isActive !== n &&
              ((this._isActive = n),
              this.cdr.markForCheck(),
              this.classes.forEach((i) => {
                n
                  ? this.renderer.addClass(this.element.nativeElement, i)
                  : this.renderer.removeClass(this.element.nativeElement, i);
              }),
              n && this.ariaCurrentWhenActive !== void 0
                ? this.renderer.setAttribute(
                    this.element.nativeElement,
                    "aria-current",
                    this.ariaCurrentWhenActive.toString()
                  )
                : this.renderer.removeAttribute(
                    this.element.nativeElement,
                    "aria-current"
                  ),
              this.isActiveChange.emit(n));
          });
      }
      isLinkActive(n) {
        let i = KP(this.routerLinkActiveOptions)
          ? this.routerLinkActiveOptions
          : this.routerLinkActiveOptions.exact || !1;
        return (o) => {
          let s = o.urlTree;
          return s ? n.isActive(s, i) : !1;
        };
      }
      hasActiveLinks() {
        let n = this.isLinkActive(this.router);
        return (this.link && n(this.link)) || this.links.some(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(De), y(He), y(bt), y(En), y(et, 8));
    }),
      (e.ɵdir = ue({
        type: e,
        selectors: [["", "routerLinkActive", ""]],
        contentQueries: function (i, o, s) {
          if ((i & 1 && Pl(s, et, 5), i & 2)) {
            let a;
            Rl((a = Fl())) && (o.links = a);
          }
        },
        inputs: {
          routerLinkActiveOptions: "routerLinkActiveOptions",
          ariaCurrentWhenActive: "ariaCurrentWhenActive",
          routerLinkActive: "routerLinkActive",
        },
        outputs: { isActiveChange: "isActiveChange" },
        exportAs: ["routerLinkActive"],
        standalone: !0,
        features: [Dt],
      }));
    let t = e;
    return t;
  })();
function KP(t) {
  return !!t.paths;
}
var nu = class {};
var YP = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            Oe((n) => n instanceof fn),
            Fn(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = Nl(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            l = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(l, s.children ?? s._loadedRoutes));
        }
        return se(o).pipe(mn());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(n, i))
            : (o = P(null));
          let s = o.pipe(
            we((a) =>
              a === null
                ? P(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return se([s, a]).pipe(mn());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(De), w(Ul), w(ut), w(nu), w(ng));
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Kb = new A(""),
  ZP = (() => {
    let e = class e {
      constructor(n, i, o, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof uo
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof fn
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof Er &&
              n.code === Wc.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Kc &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new Kc(
                  n,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      By();
    }),
      (e.ɵprov = _({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function JP(t) {
  return t.routerState.root;
}
function $s(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function XP() {
  let t = C(Ut);
  return (e) => {
    let r = t.get(qn);
    if (e !== r.components[0]) return;
    let n = t.get(De),
      i = t.get(Yb);
    t.get(og) === 1 && n.initialNavigation(),
      t.get(Zb, null, Y.Optional)?.setUpPreloading(),
      t.get(Kb, null, Y.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Yb = new A("", { factory: () => new ce() }),
  og = new A("", { providedIn: "root", factory: () => 1 });
function eR() {
  return $s(2, [
    { provide: og, useValue: 0 },
    {
      provide: Bl,
      multi: !0,
      deps: [Ut],
      useFactory: (e) => {
        let r = e.get(aD, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(De),
                  o = e.get(Yb);
                Wb(i, () => {
                  n(!0);
                }),
                  (e.get(ig).afterPreactivation = () => (
                    n(!0), o.closed ? P(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function tR() {
  return $s(3, [
    {
      provide: Bl,
      multi: !0,
      useFactory: () => {
        let e = C(De);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: og, useValue: 2 },
  ]);
}
var Zb = new A("");
function nR(t) {
  return $s(0, [
    { provide: Zb, useExisting: YP },
    { provide: nu, useExisting: t },
  ]);
}
function rR() {
  return $s(8, [hb, { provide: ru, useExisting: hb }]);
}
function iR(t) {
  let e = [
    { provide: zb, useValue: VP },
    {
      provide: qb,
      useValue: I({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return $s(9, e);
}
var gb = new A("ROUTER_FORROOT_GUARD"),
  oR = [
    zi,
    { provide: Fs, useClass: Is },
    De,
    ks,
    { provide: We, useFactory: JP, deps: [De] },
    ng,
    [],
  ],
  sg = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            oR,
            [],
            { provide: tu, multi: !0, useValue: n },
            { provide: gb, useFactory: cR, deps: [[De, new zo(), new ml()]] },
            { provide: js, useValue: i || {} },
            i?.useHash ? aR() : lR(),
            sR(),
            i?.preloadingStrategy ? nR(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? uR(i) : [],
            i?.bindToComponentInputs ? rR().ɵproviders : [],
            i?.enableViewTransitions ? iR().ɵproviders : [],
            dR(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: tu, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(w(gb, 8));
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({}));
    let t = e;
    return t;
  })();
function sR() {
  return {
    provide: Kb,
    useFactory: () => {
      let t = C(DD),
        e = C(ee),
        r = C(js),
        n = C(ig),
        i = C(Fs);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new ZP(i, n, t, e, r)
      );
    },
  };
}
function aR() {
  return { provide: In, useClass: cD };
}
function lR() {
  return { provide: In, useClass: ph };
}
function cR(t) {
  return "guarded";
}
function uR(t) {
  return [
    t.initialNavigation === "disabled" ? tR().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? eR().ɵproviders : [],
  ];
}
var mb = new A("");
function dR() {
  return [
    { provide: mb, useFactory: XP },
    { provide: Ui, multi: !0, useExisting: mb },
  ];
}
var Be = (() => {
  let e = class e {
    constructor() {}
    success(n) {
      alertify.success(n);
    }
    error(n) {
      alertify.error(n);
    }
    warning(n) {
      alertify.warning(n);
    }
    message(n) {
      alertify.message(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Yt = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.path = "https://ulassahillioglu.pythonanywhere.com/products/");
    }
    getProducts(n) {
      let i = this.path;
      return (
        n && (i += "?categoryId=" + n),
        this.http.get(i).pipe(
          N((o) => console.log(JSON.stringify(o))),
          ge(this.handleError)
        )
      );
    }
    handleError(n) {
      let i = "";
      return (
        n.error instanceof ErrorEvent
          ? (i = `An error occurred: ${n.error.message}`)
          : (i = `Server returned code: ${n.status}, error message is: ${n.message}`),
        Ke(() => new Error(i))
      );
    }
    addProduct(n) {
      return this.http.post(this.path, n).pipe(
        N((i) => console.log(JSON.stringify(i))),
        ge(this.handleError)
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(pt));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var Mr = (() => {
  let e = class e {
    constructor(n, i) {
      (this.alertifyService = n),
        (this.document = i),
        (this.products = []),
        this.loadCartFromLocalStorage();
    }
    loadCartFromLocalStorage() {
      let n = this.document.defaultView?.localStorage.getItem("cart");
      n && (this.products = JSON.parse(n));
    }
    saveCartToLocalStorage() {
      this.document.defaultView?.localStorage.setItem(
        "cart",
        JSON.stringify(this.products)
      );
    }
    addToCart(n) {
      if (this.products.some((i) => i.id === n.id)) {
        let i = this.products.find((o) => o.id === n.id);
        if (i) {
          i.quantity++,
            this.alertifyService.success(n.name + " added to cart"),
            this.saveCartToLocalStorage();
          return;
        }
      }
      this.alertifyService.success(n.name + " added to cart"),
        this.products.push(te(I({}, n), { quantity: 1 })),
        this.saveCartToLocalStorage(),
        console.log(this.products);
    }
    getCart() {
      return this.products;
    }
    removeFromCart(n) {
      (this.products = this.products.filter((i) => i.id !== n.id)),
        this.saveCartToLocalStorage(),
        this.alertifyService.error(n.name + " removed from cart");
    }
    incrementQuantity(n) {
      n.quantity++, this.saveCartToLocalStorage();
    }
    decrementQuantity(n) {
      n.quantity > 1 && (n.quantity--, this.saveCartToLocalStorage());
    }
    removeAllFromCart() {
      (this.products = []), this.saveCartToLocalStorage();
    }
    _currentPrice(n) {
      return n.price * n.quantity;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(Be), w(Ce));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Zt = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.path = "https://ulassahillioglu.pythonanywhere.com/categories/");
    }
    getProducts() {
      return this.http.get(this.path).pipe(
        N((n) => console.log(JSON.stringify(n))),
        ge(this.handleError)
      );
    }
    handleError(n) {
      let i = "";
      return (
        n.error instanceof ErrorEvent
          ? (i = `An error occurred: ${n.error.message}`)
          : (i = `Server returned code: ${n.status}, error message is: ${n.message}`),
        Ke(() => new Error(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(pt));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var po = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.path = "https://ulassahillioglu.pythonanywhere.com/on-sale");
    }
    getProducts() {
      return this.http.get(this.path).pipe(
        N((n) => console.log(JSON.stringify(n))),
        ge(this.handleError)
      );
    }
    handleError(n) {
      let i = "";
      return (
        n.error instanceof ErrorEvent
          ? (i = `An error occurred: ${n.error.message}`)
          : (i = `Server returned code: ${n.status}, error message is: ${n.message}`),
        Ke(() => new Error(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(pt));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function hR(t, e) {}
var pR = (t, e) => ({ $implicit: t, index: e });
function gR(t, e) {
  if ((t & 1 && k(0, hR, 0, 0, "ng-template", 4), t & 2)) {
    let r = fe(),
      n = r.$implicit,
      i = r.index,
      o = fe();
    M("ngTemplateOutlet", n.tplRef)(
      "ngTemplateOutletContext",
      kl(2, pR, o.preparePublicSlide(n), i)
    );
  }
}
var mR = (t, e, r, n) => ({
  width: t,
  "margin-left": e,
  "margin-right": r,
  left: n,
});
function vR(t, e) {
  if (t & 1) {
    let r = Je();
    $i(0),
      f(1, "div", 2),
      U("animationend", function () {
        let o = xe(r).$implicit,
          s = fe();
        return Ae(s.clear(o.id));
      }),
      k(2, gR, 1, 5, null, 3),
      h(),
      Bi();
  }
  if (t & 2) {
    let r = e.$implicit;
    D(),
      M("ngClass", r.classes)(
        "ngStyle",
        P0(
          4,
          mR,
          r.width + "px",
          r.marginL ? r.marginL + "px" : "",
          r.marginR ? r.marginR + "px" : "",
          r.left
        )
      )("@autoHeight", r.heightState),
      D(),
      M("ngIf", r.load);
  }
}
var yR = (t, e, r, n, i) => ({
    width: t,
    transform: e,
    transition: r,
    "padding-left": n,
    "padding-right": i,
  }),
  DR = (t, e) => ({ isMouseDragable: t, isTouchDragable: e });
function wR(t, e) {
  if ((t & 1 && (f(0, "div", 4), E(1, "owl-stage", 5), h()), t & 2)) {
    let r = fe();
    D(),
      M(
        "owlDraggable",
        kl(
          3,
          DR,
          r.owlDOMData == null ? null : r.owlDOMData.isMouseDragable,
          r.owlDOMData == null ? null : r.owlDOMData.isTouchDragable
        )
      )("stageData", r.stageData)("slidesData", r.slidesData);
  }
}
var bR = (t, e) => ({ active: t, "owl-dot-text": e });
function CR(t, e) {
  if (t & 1) {
    let r = Je();
    f(0, "div", 11),
      U("click", function () {
        let o = xe(r).$implicit,
          s = fe(2);
        return Ae(s.moveByDot(o.id));
      }),
      E(1, "span", 12),
      h();
  }
  if (t & 2) {
    let r = e.$implicit;
    M("ngClass", kl(2, bR, r.active, r.showInnerContent)),
      D(),
      M("innerHTML", r.innerContent, Cl);
  }
}
var ou = (t) => ({ disabled: t });
function _R(t, e) {
  if (t & 1) {
    let r = Je();
    $i(0),
      f(1, "div", 6)(2, "div", 7),
      U("click", function () {
        xe(r);
        let i = fe();
        return Ae(i.prev());
      }),
      h(),
      f(3, "div", 8),
      U("click", function () {
        xe(r);
        let i = fe();
        return Ae(i.next());
      }),
      h()(),
      f(4, "div", 9),
      k(5, CR, 2, 5, "div", 10),
      h(),
      Bi();
  }
  if (t & 2) {
    let r = fe();
    D(),
      M("ngClass", ln(7, ou, r.navData == null ? null : r.navData.disabled)),
      D(),
      M(
        "ngClass",
        ln(
          9,
          ou,
          r.navData == null || r.navData.prev == null
            ? null
            : r.navData.prev.disabled
        )
      )(
        "innerHTML",
        r.navData == null || r.navData.prev == null
          ? null
          : r.navData.prev.htmlText,
        Cl
      ),
      D(),
      M(
        "ngClass",
        ln(
          11,
          ou,
          r.navData == null || r.navData.next == null
            ? null
            : r.navData.next.disabled
        )
      )(
        "innerHTML",
        r.navData == null || r.navData.next == null
          ? null
          : r.navData.next.htmlText,
        Cl
      ),
      D(),
      M("ngClass", ln(13, ou, r.dotsData == null ? null : r.dotsData.disabled)),
      D(),
      M("ngForOf", r.dotsData == null ? null : r.dotsData.dots);
  }
}
var ER = (t, e, r, n, i) => ({
    "owl-rtl": t,
    "owl-loaded": e,
    "owl-responsive": r,
    "owl-drag": n,
    "owl-grab": i,
  }),
  cg = class {
    items = 3;
    skip_validateItems = !1;
    loop = !1;
    center = !1;
    rewind = !1;
    mouseDrag = !0;
    touchDrag = !0;
    pullDrag = !0;
    freeDrag = !1;
    margin = 0;
    stagePadding = 0;
    merge = !1;
    mergeFit = !0;
    autoWidth = !1;
    startPosition = 0;
    rtl = !1;
    smartSpeed = 250;
    fluidSpeed = !1;
    dragEndSpeed = !1;
    responsive = {};
    responsiveRefreshRate = 200;
    nav = !1;
    navText = ["prev", "next"];
    navSpeed = !1;
    slideBy = 1;
    dots = !0;
    dotsEach = !1;
    dotsData = !1;
    dotsSpeed = !1;
    autoplay = !1;
    autoplayTimeout = 5e3;
    autoplayHoverPause = !1;
    autoplaySpeed = !1;
    autoplayMouseleaveTimeout = 1;
    lazyLoad = !1;
    lazyLoadEager = 0;
    slideTransition = "";
    animateOut = !1;
    animateIn = !1;
    autoHeight = !1;
    URLhashListener = !1;
    constructor() {}
  },
  ug = class {
    items = "number";
    skip_validateItems = "boolean";
    loop = "boolean";
    center = "boolean";
    rewind = "boolean";
    mouseDrag = "boolean";
    touchDrag = "boolean";
    pullDrag = "boolean";
    freeDrag = "boolean";
    margin = "number";
    stagePadding = "number";
    merge = "boolean";
    mergeFit = "boolean";
    autoWidth = "boolean";
    startPosition = "number|string";
    rtl = "boolean";
    smartSpeed = "number";
    fluidSpeed = "boolean";
    dragEndSpeed = "number|boolean";
    responsive = {};
    responsiveRefreshRate = "number";
    nav = "boolean";
    navText = "string[]";
    navSpeed = "number|boolean";
    slideBy = "number|string";
    dots = "boolean";
    dotsEach = "number|boolean";
    dotsData = "boolean";
    dotsSpeed = "number|boolean";
    autoplay = "boolean";
    autoplayTimeout = "number";
    autoplayHoverPause = "boolean";
    autoplaySpeed = "number|boolean";
    autoplayMouseleaveTimeout = "number";
    lazyLoad = "boolean";
    lazyLoadEager = "number";
    slideTransition = "string";
    animateOut = "string|boolean";
    animateIn = "string|boolean";
    autoHeight = "boolean";
    URLhashListener = "boolean";
    constructor() {}
  },
  fg = (() => {
    class t {
      errorHandler;
      constructor(r) {
        this.errorHandler = r;
      }
      log(r, ...n) {
        G0() && console.log(r, ...n);
      }
      error(r) {
        this.errorHandler.handleError(r);
      }
      warn(r, ...n) {
        console.warn(r, ...n);
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Bt));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
var iC = (function (t) {
    return (t.Event = "event"), (t.State = "state"), t;
  })(iC || {}),
  su = (function (t) {
    return (t.Default = "default"), (t.Inner = "inner"), (t.Outer = "outer"), t;
  })(su || {});
var Xn = (() => {
    class t {
      logger;
      _viewSettingsShipper$ = new ce();
      _initializedCarousel$ = new ce();
      _changeSettingsCarousel$ = new ce();
      _changedSettingsCarousel$ = new ce();
      _translateCarousel$ = new ce();
      _translatedCarousel$ = new ce();
      _resizeCarousel$ = new ce();
      _resizedCarousel$ = new ce();
      _refreshCarousel$ = new ce();
      _refreshedCarousel$ = new ce();
      _dragCarousel$ = new ce();
      _draggedCarousel$ = new ce();
      settings = { items: 0 };
      owlDOMData = {
        rtl: !1,
        isResponsive: !1,
        isRefreshed: !1,
        isLoaded: !1,
        isLoading: !1,
        isMouseDragable: !1,
        isGrab: !1,
        isTouchDragable: !1,
      };
      stageData = {
        transform: "translate3d(0px,0px,0px)",
        transition: "0s",
        width: 0,
        paddingL: 0,
        paddingR: 0,
      };
      slidesData;
      navData;
      dotsData;
      _width;
      _items = [];
      _widths = [];
      _supress = {};
      _plugins = {};
      _current = null;
      _clones = [];
      _mergers = [];
      _speed = null;
      _coordinates = [];
      _breakpoint = null;
      clonedIdPrefix = "cloned-";
      _options = {};
      _invalidated = {};
      get invalidated() {
        return this._invalidated;
      }
      _states = {
        current: {},
        tags: {
          initializing: ["busy"],
          animating: ["busy"],
          dragging: ["interacting"],
        },
      };
      get states() {
        return this._states;
      }
      _pipe = [
        {
          filter: ["width", "items", "settings"],
          run: (r) => {
            r.current =
              this._items && this._items[this.relative(this._current)]?.id;
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: (r) => {
            let n = this.settings.margin || "",
              i = !this.settings.autoWidth,
              o = this.settings.rtl,
              s = { "margin-left": o ? n : "", "margin-right": o ? "" : n };
            i ||
              this.slidesData.forEach((a) => {
                (a.marginL = s["margin-left"]), (a.marginR = s["margin-right"]);
              }),
              (r.css = s);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: (r) => {
            let n =
                +(this.width() / this.settings.items).toFixed(3) -
                this.settings.margin,
              i = !this.settings.autoWidth,
              o = [],
              s = null,
              a = this._items.length;
            for (r.items = { merge: !1, width: n }; a-- > 0; )
              (s = this._mergers[a]),
                (s =
                  (this.settings.mergeFit &&
                    Math.min(s, this.settings.items)) ||
                  s),
                (r.items.merge = s > 1 || r.items.merge),
                (o[a] = i
                  ? n * s
                  : this._items[a].width
                  ? this._items[a].width
                  : n);
            (this._widths = o),
              this.slidesData.forEach((l, c) => {
                (l.width = this._widths[c]),
                  (l.marginR = r.css["margin-right"]),
                  (l.marginL = r.css["margin-left"]);
              });
          },
        },
        {
          filter: ["items", "settings"],
          run: () => {
            let r = [],
              n = this._items,
              i = this.settings,
              o = Math.max(i.items * 2, 4),
              s = Math.ceil(n.length / 2) * 2,
              a = [],
              l = [],
              c = i.loop && n.length ? (i.rewind ? o : Math.max(o, s)) : 0;
            for (c /= 2; c-- > 0; )
              r.push(this.normalize(r.length / 2, !0)),
                a.push(I({}, this.slidesData[r[r.length - 1]])),
                r.push(this.normalize(n.length - 1 - (r.length - 1) / 2, !0)),
                l.unshift(I({}, this.slidesData[r[r.length - 1]]));
            (this._clones = r),
              (a = a.map(
                (u) => (
                  (u.id = `${this.clonedIdPrefix}${u.id}`),
                  (u.isActive = !1),
                  (u.isCloned = !0),
                  u
                )
              )),
              (l = l.map(
                (u) => (
                  (u.id = `${this.clonedIdPrefix}${u.id}`),
                  (u.isActive = !1),
                  (u.isCloned = !0),
                  u
                )
              )),
              (this.slidesData = l.concat(this.slidesData).concat(a));
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: () => {
            let r = this.settings.rtl ? 1 : -1,
              n = this._clones.length + this._items.length,
              i = [],
              o = -1,
              s = 0,
              a = 0;
            for (; ++o < n; )
              (s = i[o - 1] || 0),
                (a = this._widths[this.relative(o)] + this.settings.margin),
                i.push(s + a * r);
            this._coordinates = i;
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: () => {
            let r = this.settings.stagePadding,
              n = this._coordinates,
              i = {
                width: Math.ceil(Math.abs(n[n.length - 1])) + r * 2,
                "padding-left": r || "",
                "padding-right": r || "",
              };
            (this.stageData.width = i.width),
              (this.stageData.paddingL = i["padding-left"]),
              (this.stageData.paddingR = i["padding-right"]);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: (r) => {
            let n = r.current
              ? this.slidesData.findIndex((i) => i.id === r.current)
              : 0;
            (n = Math.max(this.minimum(), Math.min(this.maximum(), n))),
              this.reset(n);
          },
        },
        {
          filter: ["position"],
          run: () => {
            this.animate(this.coordinates(this._current));
          },
        },
        {
          filter: ["width", "position", "items", "settings"],
          run: () => {
            let r = this.settings.rtl ? 1 : -1,
              n = this.settings.stagePadding * 2,
              i = [],
              o,
              s,
              a,
              l,
              c,
              u;
            if (
              ((o = this.coordinates(this.current())),
              typeof o == "number" ? (o += n) : (o = 0),
              (s = o + this.width() * r),
              r === -1 && this.settings.center)
            ) {
              let d = this._coordinates.filter((p) =>
                this.settings.items % 2 === 1 ? p >= o : p > o
              );
              o = d.length ? d[d.length - 1] : o;
            }
            for (c = 0, u = this._coordinates.length; c < u; c++)
              (a = Math.ceil(this._coordinates[c - 1] || 0)),
                (l = Math.ceil(Math.abs(this._coordinates[c]) + n * r)),
                ((this._op(a, "<=", o) && this._op(a, ">", s)) ||
                  (this._op(l, "<", o) && this._op(l, ">", s))) &&
                  i.push(c);
            this.slidesData.forEach((d) => ((d.isActive = !1), d)),
              i.forEach((d) => {
                this.slidesData[d].isActive = !0;
              }),
              this.settings.center &&
                (this.slidesData.forEach((d) => ((d.isCentered = !1), d)),
                (this.slidesData[this.current()].isCentered = !0));
          },
        },
      ];
      constructor(r) {
        this.logger = r;
      }
      getViewCurSettings() {
        return this._viewSettingsShipper$.asObservable();
      }
      getInitializedState() {
        return this._initializedCarousel$.asObservable();
      }
      getChangeState() {
        return this._changeSettingsCarousel$.asObservable();
      }
      getChangedState() {
        return this._changedSettingsCarousel$.asObservable();
      }
      getTranslateState() {
        return this._translateCarousel$.asObservable();
      }
      getTranslatedState() {
        return this._translatedCarousel$.asObservable();
      }
      getResizeState() {
        return this._resizeCarousel$.asObservable();
      }
      getResizedState() {
        return this._resizedCarousel$.asObservable();
      }
      getRefreshState() {
        return this._refreshCarousel$.asObservable();
      }
      getRefreshedState() {
        return this._refreshedCarousel$.asObservable();
      }
      getDragState() {
        return this._dragCarousel$.asObservable();
      }
      getDraggedState() {
        return this._draggedCarousel$.asObservable();
      }
      setOptions(r) {
        let n = new cg(),
          i = this._validateOptions(r, n);
        this._options = I(I({}, n), i);
      }
      _validateOptions(r, n) {
        let i = I({}, r),
          o = new ug(),
          s = (a, l) => (
            this.logger.log(
              `options.${l} must be type of ${a}; ${l}=${r[l]} skipped to defaults: ${l}=${n[l]}`
            ),
            n[l]
          );
        for (let a in i)
          if (i.hasOwnProperty(a)) {
            if (o[a] === "number")
              this._isNumeric(i[a])
                ? ((i[a] = +i[a]),
                  (i[a] =
                    a === "items"
                      ? this._validateItems(i[a], i.skip_validateItems)
                      : i[a]))
                : (i[a] = s(o[a], a));
            else if (o[a] === "boolean" && typeof i[a] != "boolean")
              i[a] = s(o[a], a);
            else if (
              o[a] === "number|boolean" &&
              !this._isNumberOrBoolean(i[a])
            )
              i[a] = s(o[a], a);
            else if (o[a] === "number|string" && !this._isNumberOrString(i[a]))
              i[a] = s(o[a], a);
            else if (
              o[a] === "string|boolean" &&
              !this._isStringOrBoolean(i[a])
            )
              i[a] = s(o[a], a);
            else if (o[a] === "string[]")
              if (Array.isArray(i[a])) {
                let l = !1;
                i[a].forEach((c) => {
                  l = typeof c == "string";
                }),
                  l || (i[a] = s(o[a], a));
              } else i[a] = s(o[a], a);
          }
        return i;
      }
      _validateItems(r, n) {
        let i = r;
        return (
          r > this._items.length
            ? n
              ? this.logger.log(
                  "The option 'items' in your options is bigger than the number of slides. The navigation got disabled"
                )
              : ((i = this._items.length),
                this.logger.log(
                  "The option 'items' in your options is bigger than the number of slides. This option is updated to the current number of slides and the navigation got disabled"
                ))
            : r === this._items.length &&
              (this.settings.dots || this.settings.nav) &&
              this.logger.log(
                "Option 'items' in your options is equal to the number of slides. So the navigation got disabled"
              ),
          i
        );
      }
      setCarouselWidth(r) {
        this._width = r;
      }
      setup(r, n, i) {
        this.setCarouselWidth(r),
          this.setItems(n),
          this._defineSlidesData(),
          this.setOptions(i),
          (this.settings = I({}, this._options)),
          this.setOptionsForViewport(),
          this._trigger("change", {
            property: { name: "settings", value: this.settings },
          }),
          this.invalidate("settings"),
          this._trigger("changed", {
            property: { name: "settings", value: this.settings },
          });
      }
      setOptionsForViewport() {
        let r = this._width,
          n = this._options.responsive,
          i = -1;
        if (!Object.keys(n).length) return;
        if (!r) {
          this.settings.items = 1;
          return;
        }
        for (let s in n)
          n.hasOwnProperty(s) && +s <= r && +s > i && (i = Number(s));
        (this.settings = te(I(I({}, this._options), n[i]), {
          items:
            n[i] && n[i].items
              ? this._validateItems(
                  n[i].items,
                  this._options.skip_validateItems
                )
              : this._options.items,
        })),
          delete this.settings.responsive,
          (this.owlDOMData.isResponsive = !0),
          (this.owlDOMData.isMouseDragable = this.settings.mouseDrag),
          (this.owlDOMData.isTouchDragable = this.settings.touchDrag);
        let o = [];
        this._items.forEach((s) => {
          let a = this.settings.merge ? s.dataMerge : 1;
          o.push(a);
        }),
          (this._mergers = o),
          (this._breakpoint = i),
          this.invalidate("settings");
      }
      initialize(r) {
        this.enter("initializing"),
          (this.owlDOMData.rtl = this.settings.rtl),
          this._mergers.length && (this._mergers = []),
          r.forEach((n) => {
            let i = this.settings.merge ? n.dataMerge : 1;
            this._mergers.push(i);
          }),
          (this._clones = []),
          this.reset(
            this._isNumeric(this.settings.startPosition)
              ? +this.settings.startPosition
              : 0
          ),
          this.invalidate("items"),
          this.refresh(),
          (this.owlDOMData.isLoaded = !0),
          (this.owlDOMData.isMouseDragable = this.settings.mouseDrag),
          (this.owlDOMData.isTouchDragable = this.settings.touchDrag),
          this.sendChanges(),
          this.leave("initializing"),
          this._trigger("initialized");
      }
      sendChanges() {
        this._viewSettingsShipper$.next({
          owlDOMData: this.owlDOMData,
          stageData: this.stageData,
          slidesData: this.slidesData,
          navData: this.navData,
          dotsData: this.dotsData,
        });
      }
      _optionsLogic() {
        this.settings.autoWidth &&
          ((this.settings.stagePadding = 0), (this.settings.merge = !1));
      }
      update() {
        let r = 0,
          n = this._pipe.length,
          i = (s) => this._invalidated[s],
          o = {};
        for (; r < n; ) {
          let s = this._pipe[r].filter.filter(i);
          (this._invalidated.all || s.length > 0) && this._pipe[r].run(o), r++;
        }
        this.slidesData.forEach(
          (s) => (s.classes = this.setCurSlideClasses(s))
        ),
          this.sendChanges(),
          (this._invalidated = {}),
          this.is("valid") || this.enter("valid");
      }
      width(r) {
        switch (((r = r || su.Default), r)) {
          case su.Inner:
          case su.Outer:
            return this._width;
          default:
            return (
              this._width -
              this.settings.stagePadding * 2 +
              this.settings.margin
            );
        }
      }
      refresh() {
        this.enter("refreshing"),
          this._trigger("refresh"),
          this._defineSlidesData(),
          this.setOptionsForViewport(),
          this._optionsLogic(),
          this.update(),
          this.leave("refreshing"),
          this._trigger("refreshed");
      }
      onResize(r) {
        if (!this._items.length) return !1;
        this.setCarouselWidth(r),
          this.enter("resizing"),
          this._trigger("resize"),
          this.invalidate("width"),
          this.refresh(),
          this.leave("resizing"),
          this._trigger("resized");
      }
      prepareDragging(r) {
        let n = null,
          i;
        return (
          (i = this.stageData.transform
            .replace(/.*\(|\)| |[^,-\d]\w|\)/g, "")
            .split(",")),
          (n = { x: +i[0], y: +i[1] }),
          this.is("animating") && this.invalidate("position"),
          r.type === "mousedown" && (this.owlDOMData.isGrab = !0),
          this.speed(0),
          n
        );
      }
      enterDragging() {
        this.enter("dragging"), this._trigger("drag");
      }
      defineNewCoordsDrag(r, n) {
        let i = null,
          o = null,
          s = null,
          a = this.difference(n.pointer, this.pointer(r)),
          l = this.difference(n.stage.start, a);
        return this.is("dragging")
          ? (this.settings.loop
              ? ((i = this.coordinates(this.minimum())),
                (o = +this.coordinates(this.maximum() + 1) - i),
                (l.x = ((((l.x - i) % o) + o) % o) + i))
              : ((i = this.settings.rtl
                  ? this.coordinates(this.maximum())
                  : this.coordinates(this.minimum())),
                (o = this.settings.rtl
                  ? this.coordinates(this.minimum())
                  : this.coordinates(this.maximum())),
                (s = this.settings.pullDrag ? (-1 * a.x) / 5 : 0),
                (l.x = Math.max(Math.min(l.x, i + s), o + s))),
            l)
          : !1;
      }
      finishDragging(r, n, i) {
        let o = ["right", "left"],
          s = this.difference(n.pointer, this.pointer(r)),
          a = n.stage.current,
          l =
            o[
              +(this.settings.rtl
                ? s.x < +this.settings.rtl
                : s.x > +this.settings.rtl)
            ],
          c,
          u,
          d;
        ((s.x !== 0 && this.is("dragging")) || !this.is("valid")) &&
          (this.speed(+this.settings.dragEndSpeed || this.settings.smartSpeed),
          (c = this.closest(a.x, s.x !== 0 ? l : n.direction)),
          (u = this.current()),
          (d = this.current(c === -1 ? void 0 : c)),
          u !== d && (this.invalidate("position"), this.update()),
          (n.direction = l),
          (Math.abs(s.x) > 3 || new Date().getTime() - n.time > 300) && i()),
          this.is("dragging") &&
            (this.leave("dragging"), this._trigger("dragged"));
      }
      closest(r, n) {
        let o = this.width(),
          s = this.coordinates(),
          a = -1;
        this.settings.center && (s = s.map((l) => (l === 0 && (l += 1e-6), l)));
        for (
          let l = 0;
          l < s.length &&
          (n === "left" && r > s[l] - 30 && r < s[l] + 30
            ? (a = l)
            : n === "right" && r > s[l] - o - 30 && r < s[l] - o + 30
            ? (a = l + 1)
            : this._op(r, "<", s[l]) && this._op(r, ">", s[l + 1] || s[l] - o)
            ? (a = n === "left" ? l + 1 : l)
            : n === null && r > s[l] - 30 && r < s[l] + 30 && (a = l),
          a === -1);
          l++
        );
        return (
          this.settings.loop ||
            (this._op(r, ">", s[this.minimum()])
              ? (a = r = this.minimum())
              : this._op(r, "<", s[this.maximum()]) &&
                (a = r = this.maximum())),
          a
        );
      }
      animate(r) {
        let n = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd(),
          n && (this.enter("animating"), this._trigger("translate")),
          (this.stageData.transform = "translate3d(" + r + "px,0px,0px)"),
          (this.stageData.transition =
            this.speed() / 1e3 +
            "s" +
            (this.settings.slideTransition
              ? " " + this.settings.slideTransition
              : ""));
      }
      is(r) {
        return this._states.current[r] && this._states.current[r] > 0;
      }
      current(r) {
        if (r === void 0) return this._current;
        if (this._items.length !== 0) {
          if (((r = this.normalize(r)), this._current !== r)) {
            let n = this._trigger("change", {
              property: { name: "position", value: r },
            });
            (this._current = r),
              this.invalidate("position"),
              this._trigger("changed", {
                property: { name: "position", value: this._current },
              });
          }
          return this._current;
        }
      }
      invalidate(r) {
        return (
          typeof r == "string" &&
            ((this._invalidated[r] = !0),
            this.is("valid") && this.leave("valid")),
          Object.keys(this._invalidated)
        );
      }
      reset(r) {
        (r = this.normalize(r)),
          r !== void 0 &&
            ((this._speed = 0),
            (this._current = r),
            this._suppress(["translate", "translated"]),
            this.animate(this.coordinates(r)),
            this._release(["translate", "translated"]));
      }
      normalize(r, n) {
        let i = this._items.length,
          o = n ? 0 : this._clones.length;
        return (
          !this._isNumeric(r) || i < 1
            ? (r = void 0)
            : (r < 0 || r >= i + o) &&
              (r = ((((r - o / 2) % i) + i) % i) + o / 2),
          r
        );
      }
      relative(r) {
        return (r -= this._clones.length / 2), this.normalize(r, !0);
      }
      maximum(r = !1) {
        let n = this.settings,
          i = this._coordinates.length,
          o,
          s,
          a;
        if (n.loop) i = this._clones.length / 2 + this._items.length - 1;
        else if (n.autoWidth || n.merge) {
          for (
            o = this._items.length,
              s = this.slidesData[--o].width,
              a = this._width;
            o-- > 0 &&
            ((s += +this.slidesData[o].width + this.settings.margin), !(s > a));

          );
          i = o + 1;
        } else
          n.center
            ? (i = this._items.length - 1)
            : (i = this._items.length - n.items);
        return r && (i -= this._clones.length / 2), Math.max(i, 0);
      }
      minimum(r = !1) {
        return r ? 0 : this._clones.length / 2;
      }
      items(r) {
        return r === void 0
          ? this._items.slice()
          : ((r = this.normalize(r, !0)), [this._items[r]]);
      }
      mergers(r) {
        return r === void 0
          ? this._mergers.slice()
          : ((r = this.normalize(r, !0)), this._mergers[r]);
      }
      clones(r) {
        let n = this._clones.length / 2,
          i = n + this._items.length,
          o = (s) => (s % 2 === 0 ? i + s / 2 : n - (s + 1) / 2);
        return r === void 0
          ? this._clones.map((s, a) => o(a))
          : this._clones
              .map((s, a) => (s === r ? o(a) : null))
              .filter((s) => s);
      }
      speed(r) {
        return r !== void 0 && (this._speed = r), this._speed;
      }
      coordinates(r) {
        let n = 1,
          i = r - 1,
          o,
          s;
        return r === void 0
          ? ((s = this._coordinates.map((a, l) => this.coordinates(l))), s)
          : (this.settings.center
              ? (this.settings.rtl && ((n = -1), (i = r + 1)),
                (o = this._coordinates[r]),
                (o +=
                  ((this.width() - o + (this._coordinates[i] || 0)) / 2) * n))
              : (o = this._coordinates[i] || 0),
            (o = Math.ceil(o)),
            o);
      }
      _duration(r, n, i) {
        return i === 0
          ? 0
          : Math.min(Math.max(Math.abs(n - r), 1), 6) *
              Math.abs(+i || this.settings.smartSpeed);
      }
      to(r, n) {
        let i = this.current(),
          o = null,
          s = r - this.relative(i),
          a = this.maximum(),
          l = 0,
          c = +(s > 0) - +(s < 0),
          u = this._items.length,
          d = this.minimum();
        this.settings.loop
          ? (!this.settings.rewind && Math.abs(s) > u / 2 && (s += c * -1 * u),
            (r = i + s),
            (o = ((((r - d) % u) + u) % u) + d),
            o !== r &&
              o - s <= a &&
              o - s > 0 &&
              ((i = o - s),
              (r = o),
              (l = 30),
              this.reset(i),
              this.sendChanges()))
          : this.settings.rewind
          ? ((a += 1), (r = ((r % a) + a) % a))
          : (r = Math.max(d, Math.min(a, r))),
          setTimeout(() => {
            this.speed(this._duration(i, r, n)), this.current(r), this.update();
          }, l);
      }
      next(r) {
        (r = r || !1), this.to(this.relative(this.current()) + 1, r);
      }
      prev(r) {
        (r = r || !1), this.to(this.relative(this.current()) - 1, r);
      }
      onTransitionEnd(r) {
        if (r !== void 0) return !1;
        this.leave("animating"), this._trigger("translated");
      }
      _viewport() {
        let r;
        return (
          this._width
            ? (r = this._width)
            : this.logger.log("Can not detect viewport width."),
          r
        );
      }
      setItems(r) {
        this._items = r;
      }
      _defineSlidesData() {
        let r;
        this.slidesData &&
          this.slidesData.length &&
          ((r = new Map()),
          this.slidesData.forEach((n) => {
            n.load && r.set(n.id, n.load);
          })),
          (this.slidesData = this._items.map((n) => ({
            id: `${n.id}`,
            isActive: !1,
            tplRef: n.tplRef,
            dataMerge: n.dataMerge,
            width: 0,
            isCloned: !1,
            load: r ? r.get(n.id) : !1,
            hashFragment: n.dataHash,
          })));
      }
      setCurSlideClasses(r) {
        let n = {
          active: r.isActive,
          center: r.isCentered,
          cloned: r.isCloned,
          animated: r.isAnimated,
          "owl-animated-in": r.isDefAnimatedIn,
          "owl-animated-out": r.isDefAnimatedOut,
        };
        return (
          this.settings.animateIn &&
            (n[this.settings.animateIn] = r.isCustomAnimatedIn),
          this.settings.animateOut &&
            (n[this.settings.animateOut] = r.isCustomAnimatedOut),
          n
        );
      }
      _op(r, n, i) {
        let o = this.settings.rtl;
        switch (n) {
          case "<":
            return o ? r > i : r < i;
          case ">":
            return o ? r < i : r > i;
          case ">=":
            return o ? r <= i : r >= i;
          case "<=":
            return o ? r >= i : r <= i;
          default:
            break;
        }
      }
      _trigger(r, n, i, o, s) {
        switch (r) {
          case "initialized":
            this._initializedCarousel$.next(r);
            break;
          case "change":
            this._changeSettingsCarousel$.next(n);
            break;
          case "changed":
            this._changedSettingsCarousel$.next(n);
            break;
          case "drag":
            this._dragCarousel$.next(r);
            break;
          case "dragged":
            this._draggedCarousel$.next(r);
            break;
          case "resize":
            this._resizeCarousel$.next(r);
            break;
          case "resized":
            this._resizedCarousel$.next(r);
            break;
          case "refresh":
            this._refreshCarousel$.next(r);
            break;
          case "refreshed":
            this._refreshedCarousel$.next(r);
            break;
          case "translate":
            this._translateCarousel$.next(r);
            break;
          case "translated":
            this._translatedCarousel$.next(r);
            break;
          default:
            break;
        }
      }
      enter(r) {
        [r].concat(this._states.tags[r] || []).forEach((n) => {
          this._states.current[n] === void 0 && (this._states.current[n] = 0),
            this._states.current[n]++;
        });
      }
      leave(r) {
        [r].concat(this._states.tags[r] || []).forEach((n) => {
          (this._states.current[n] === 0 || this._states.current[n]) &&
            this._states.current[n]--;
        });
      }
      register(r) {
        r.type === iC.State &&
          (this._states.tags[r.name]
            ? (this._states.tags[r.name] = this._states.tags[r.name].concat(
                r.tags
              ))
            : (this._states.tags[r.name] = r.tags),
          (this._states.tags[r.name] = this._states.tags[r.name].filter(
            (n, i) => this._states.tags[r.name].indexOf(n) === i
          )));
      }
      _suppress(r) {
        r.forEach((n) => {
          this._supress[n] = !0;
        });
      }
      _release(r) {
        r.forEach((n) => {
          delete this._supress[n];
        });
      }
      pointer(r) {
        let n = { x: null, y: null };
        return (
          (r = r.originalEvent || r || window.event),
          (r =
            r.touches && r.touches.length
              ? r.touches[0]
              : r.changedTouches && r.changedTouches.length
              ? r.changedTouches[0]
              : r),
          r.pageX
            ? ((n.x = r.pageX), (n.y = r.pageY))
            : ((n.x = r.clientX), (n.y = r.clientY)),
          n
        );
      }
      _isNumeric(r) {
        return !isNaN(parseFloat(r));
      }
      _isNumberOrBoolean(r) {
        return this._isNumeric(r) || typeof r == "boolean";
      }
      _isNumberOrString(r) {
        return this._isNumeric(r) || typeof r == "string";
      }
      _isStringOrBoolean(r) {
        return typeof r == "string" || typeof r == "boolean";
      }
      difference(r, n) {
        return r === null || n === null
          ? { x: 0, y: 0 }
          : { x: r.x - n.x, y: r.y - n.y };
      }
      static ɵfac = function (n) {
        return new (n || t)(w(fg));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  Xb = (() => {
    class t {
      carouselService;
      navSubscription;
      _initialized = !1;
      _pages = [];
      _navData = {
        disabled: !1,
        prev: { disabled: !1, htmlText: "" },
        next: { disabled: !1, htmlText: "" },
      };
      _dotsData = { disabled: !1, dots: [] };
      constructor(r) {
        (this.carouselService = r), this.spyDataStreams();
      }
      ngOnDestroy() {
        this.navSubscription.unsubscribe();
      }
      spyDataStreams() {
        let r = this.carouselService.getInitializedState().pipe(
            N((s) => {
              this.initialize(),
                this._updateNavPages(),
                this.draw(),
                this.update(),
                this.carouselService.sendChanges();
            })
          ),
          n = this.carouselService.getChangedState().pipe(
            Oe((s) => s.property.name === "position"),
            N((s) => {
              this.update();
            })
          ),
          i = this.carouselService.getRefreshedState().pipe(
            N(() => {
              this._updateNavPages(),
                this.draw(),
                this.update(),
                this.carouselService.sendChanges();
            })
          ),
          o = Xt(r, n, i);
        this.navSubscription = o.subscribe(() => {});
      }
      initialize() {
        (this._navData.disabled = !0),
          (this._navData.prev.htmlText =
            this.carouselService.settings.navText[0]),
          (this._navData.next.htmlText =
            this.carouselService.settings.navText[1]),
          (this._dotsData.disabled = !0),
          (this.carouselService.navData = this._navData),
          (this.carouselService.dotsData = this._dotsData);
      }
      _updateNavPages() {
        let r,
          n,
          i,
          o = this.carouselService.clones().length / 2,
          s = o + this.carouselService.items().length,
          a = this.carouselService.maximum(!0),
          l = [],
          c = this.carouselService.settings,
          u =
            c.center || c.autoWidth || c.dotsData
              ? 1
              : Math.floor(Number(c.dotsEach)) || Math.floor(c.items);
        if (
          ((u = +u),
          c.slideBy !== "page" && (c.slideBy = Math.min(+c.slideBy, c.items)),
          c.dots || c.slideBy === "page")
        )
          for (r = o, n = 0, i = 0; r < s; r++) {
            if (n >= u || n === 0) {
              if (
                (l.push({ start: Math.min(a, r - o), end: r - o + u - 1 }),
                Math.min(a, r - o) === a)
              )
                break;
              (n = 0), ++i;
            }
            n += this.carouselService.mergers(this.carouselService.relative(r));
          }
        this._pages = l;
      }
      draw() {
        let r,
          n = this.carouselService.settings,
          i = this.carouselService.items(),
          o = i.length <= n.items;
        if (
          ((this._navData.disabled = !n.nav || o),
          (this._dotsData.disabled = !n.dots || o),
          n.dots)
        )
          if (
            ((r = this._pages.length - this._dotsData.dots.length),
            n.dotsData && r !== 0)
          )
            (this._dotsData.dots = []),
              i.forEach((s) => {
                this._dotsData.dots.push({
                  active: !1,
                  id: `dot-${s.id}`,
                  innerContent: s.dotContent,
                  showInnerContent: !0,
                });
              });
          else if (r > 0) {
            let s =
              this._dotsData.dots.length > 0 ? this._dotsData.dots.length : 0;
            for (let a = 0; a < r; a++)
              this._dotsData.dots.push({
                active: !1,
                id: `dot-${a + s}`,
                innerContent: "",
                showInnerContent: !1,
              });
          } else r < 0 && this._dotsData.dots.splice(r, Math.abs(r));
        (this.carouselService.navData = this._navData),
          (this.carouselService.dotsData = this._dotsData);
      }
      update() {
        this._updateNavButtons(), this._updateDots();
      }
      _updateNavButtons() {
        let r = this.carouselService.settings,
          n = r.loop || r.rewind,
          i = this.carouselService.relative(this.carouselService.current());
        r.nav &&
          ((this._navData.prev.disabled =
            !n && i <= this.carouselService.minimum(!0)),
          (this._navData.next.disabled =
            !n && i >= this.carouselService.maximum(!0))),
          (this.carouselService.navData = this._navData);
      }
      _updateDots() {
        let r;
        this.carouselService.settings.dots &&
          (this._dotsData.dots.forEach((n) => {
            n.active === !0 && (n.active = !1);
          }),
          (r = this._current()),
          this._dotsData.dots.length && (this._dotsData.dots[r].active = !0),
          (this.carouselService.dotsData = this._dotsData));
      }
      _current() {
        let r = this.carouselService.relative(this.carouselService.current()),
          n,
          i = this._pages.filter((o, s) => o.start <= r && o.end >= r).pop();
        return (
          (n = this._pages.findIndex(
            (o) => o.start === i.start && o.end === i.end
          )),
          n
        );
      }
      _getPosition(r) {
        let n,
          i,
          o = this.carouselService.settings;
        return (
          o.slideBy === "page"
            ? ((n = this._current()),
              (i = this._pages.length),
              r ? ++n : --n,
              (n = this._pages[((n % i) + i) % i].start))
            : ((n = this.carouselService.relative(
                this.carouselService.current()
              )),
              (i = this.carouselService.items().length),
              r ? (n += +o.slideBy) : (n -= +o.slideBy)),
          n
        );
      }
      next(r) {
        this.carouselService.to(this._getPosition(!0), r);
      }
      prev(r) {
        this.carouselService.to(this._getPosition(!1), r);
      }
      to(r, n, i) {
        let o;
        !i && this._pages.length
          ? ((o = this._pages.length),
            this.carouselService.to(this._pages[((r % o) + o) % o].start, n))
          : this.carouselService.to(r, n);
      }
      moveByDot(r) {
        let n = this._dotsData.dots.findIndex((i) => r === i.id);
        this.to(n, this.carouselService.settings.dotsSpeed);
      }
      toSlideById(r) {
        let n = this.carouselService.slidesData.findIndex(
          (i) => i.id === r && i.isCloned === !1
        );
        n === -1 ||
          n === this.carouselService.current() ||
          this.carouselService.to(this.carouselService.relative(n), !1);
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Xn));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  hg = new A("WindowToken"),
  Bs = class {
    get nativeWindow() {
      throw new Error("Not implemented.");
    }
  },
  SR = (() => {
    class t extends Bs {
      constructor() {
        super();
      }
      get nativeWindow() {
        return window;
      }
      static ɵfac = function (n) {
        return new (n || t)();
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function IR(t, e) {
  return Xo(e)
    ? t.nativeWindow
    : { setTimeout: (n, i) => {}, clearTimeout: (n) => {} };
}
var MR = { provide: Bs, useClass: SR },
  TR = { provide: hg, useFactory: IR, deps: [Bs, ft] },
  xR = [MR, TR],
  pg = new A("DocumentToken"),
  Us = class {
    get nativeDocument() {
      throw new Error("Not implemented.");
    }
  },
  AR = (() => {
    class t extends Us {
      constructor() {
        super();
      }
      get nativeDocument() {
        return document;
      }
      static ɵfac = function (n) {
        return new (n || t)();
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function NR(t, e) {
  return Xo(e) ? t.nativeDocument : { hidden: !1, visibilityState: "visible" };
}
var OR = { provide: Us, useClass: AR },
  PR = { provide: pg, useFactory: NR, deps: [Us, ft] },
  RR = [OR, PR],
  eC = (() => {
    class t {
      carouselService;
      ngZone;
      autoplaySubscription;
      _timeout = null;
      _paused = !1;
      _isArtificialAutoplayTimeout;
      _isAutoplayStopped = !1;
      get isAutoplayStopped() {
        return this._isAutoplayStopped;
      }
      set isAutoplayStopped(r) {
        this._isAutoplayStopped = r;
      }
      winRef;
      docRef;
      constructor(r, n, i, o) {
        (this.carouselService = r),
          (this.ngZone = o),
          (this.winRef = n),
          (this.docRef = i),
          this.spyDataStreams();
      }
      ngOnDestroy() {
        this.autoplaySubscription.unsubscribe();
      }
      spyDataStreams() {
        let r = this.carouselService.getInitializedState().pipe(
            N(() => {
              this.carouselService.settings.autoplay && this.play();
            })
          ),
          n = this.carouselService.getChangedState().pipe(
            N((s) => {
              this._handleChangeObservable(s);
            })
          ),
          i = this.carouselService.getResizedState().pipe(
            N(() => {
              this.carouselService.settings.autoplay && !this._isAutoplayStopped
                ? this.play()
                : this.stop();
            })
          ),
          o = Xt(r, n, i);
        this.autoplaySubscription = o.subscribe(() => {});
      }
      play(r, n) {
        this._paused &&
          ((this._paused = !1),
          this._setAutoPlayInterval(
            this.carouselService.settings.autoplayMouseleaveTimeout
          )),
          !this.carouselService.is("rotating") &&
            (this.carouselService.enter("rotating"),
            this._setAutoPlayInterval());
      }
      _getNextTimeout(r, n) {
        return (
          this._timeout && this.winRef.clearTimeout(this._timeout),
          (this._isArtificialAutoplayTimeout = !!r),
          this.ngZone.runOutsideAngular(() =>
            this.winRef.setTimeout(() => {
              this.ngZone.run(() => {
                this._paused ||
                  this.carouselService.is("busy") ||
                  this.carouselService.is("interacting") ||
                  this.docRef.hidden ||
                  this.carouselService.next(
                    n || this.carouselService.settings.autoplaySpeed
                  );
              });
            }, r || this.carouselService.settings.autoplayTimeout)
          )
        );
      }
      _setAutoPlayInterval(r) {
        this._timeout = this._getNextTimeout(r);
      }
      stop() {
        this.carouselService.is("rotating") &&
          ((this._paused = !0),
          this.winRef.clearTimeout(this._timeout),
          this.carouselService.leave("rotating"));
      }
      pause() {
        this.carouselService.is("rotating") && (this._paused = !0);
      }
      _handleChangeObservable(r) {
        r.property.name === "settings"
          ? this.carouselService.settings.autoplay
            ? this.play()
            : this.stop()
          : r.property.name === "position" &&
            this.carouselService.settings.autoplay &&
            this._setAutoPlayInterval();
      }
      _playAfterTranslated() {
        P("translated")
          .pipe(
            je((r) => this.carouselService.getTranslatedState()),
            Ve(),
            Oe(() => this._isArtificialAutoplayTimeout),
            N(() => this._setAutoPlayInterval())
          )
          .subscribe(() => {});
      }
      startPausing() {
        this.carouselService.settings.autoplayHoverPause &&
          this.carouselService.is("rotating") &&
          this.pause();
      }
      startPlayingMouseLeave() {
        this.carouselService.settings.autoplayHoverPause &&
          this.carouselService.is("rotating") &&
          (this.play(), this._playAfterTranslated());
      }
      startPlayingTouchEnd() {
        this.carouselService.settings.autoplayHoverPause &&
          this.carouselService.is("rotating") &&
          (this.play(), this._playAfterTranslated());
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Xn), w(hg), w(pg), w(ee));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  tC = (() => {
    class t {
      carouselService;
      lazyLoadSubscription;
      constructor(r) {
        (this.carouselService = r), this.spyDataStreams();
      }
      ngOnDestroy() {
        this.lazyLoadSubscription.unsubscribe();
      }
      spyDataStreams() {
        let r = this.carouselService.getInitializedState().pipe(
            N(() => {
              let s =
                this.carouselService.settings &&
                !this.carouselService.settings.lazyLoad;
              this.carouselService.slidesData.forEach((a) => (a.load = !!s));
            })
          ),
          n = this.carouselService.getChangeState(),
          i = this.carouselService.getResizedState(),
          o = Xt(r, n, i).pipe(N((s) => this._defineLazyLoadSlides(s)));
        this.lazyLoadSubscription = o.subscribe(() => {});
      }
      _defineLazyLoadSlides(r) {
        if (
          !(
            !this.carouselService.settings ||
            !this.carouselService.settings.lazyLoad
          ) &&
          ((r.property && r.property.name === "position") ||
            r === "initialized" ||
            r === "resized")
        ) {
          let n = this.carouselService.settings,
            i = this.carouselService.clones().length,
            o = (n.center && Math.ceil(n.items / 2)) || n.items,
            s = (n.center && o * -1) || 0,
            a =
              (r.property && r.property.value !== void 0
                ? r.property.value
                : this.carouselService.current()) + s;
          for (
            n.lazyLoadEager > 0 &&
            ((o += n.lazyLoadEager), n.loop && ((a -= n.lazyLoadEager), o++));
            s++ < o;

          )
            this._load(i / 2 + this.carouselService.relative(a)),
              i &&
                this.carouselService
                  .clones(this.carouselService.relative(a))
                  .forEach((l) => this._load(l)),
              a++;
        }
      }
      _load(r) {
        this.carouselService.slidesData[r].load ||
          (this.carouselService.slidesData[r].load = !0);
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Xn));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  dg = (() => {
    class t {
      carouselService;
      animateSubscription;
      swapping = !0;
      previous = void 0;
      next = void 0;
      constructor(r) {
        (this.carouselService = r), this.spyDataStreams();
      }
      ngOnDestroy() {
        this.animateSubscription.unsubscribe();
      }
      spyDataStreams() {
        let r = this.carouselService.getChangeState().pipe(
            N((c) => {
              c.property.name === "position" &&
                ((this.previous = this.carouselService.current()),
                (this.next = c.property.value));
            })
          ),
          n = this.carouselService.getDragState(),
          i = this.carouselService.getDraggedState(),
          o = this.carouselService.getTranslatedState(),
          s = Xt(n, i, o).pipe(N((c) => (this.swapping = c === "translated"))),
          a = this.carouselService.getTranslateState().pipe(
            N((c) => {
              this.swapping &&
                (this.carouselService._options.animateOut ||
                  this.carouselService._options.animateIn) &&
                this._swap();
            })
          ),
          l = Xt(r, a, s).pipe();
        this.animateSubscription = l.subscribe(() => {});
      }
      _swap() {
        if (this.carouselService.settings.items !== 1) return;
        this.carouselService.speed(0);
        let r,
          n = this.carouselService.slidesData[this.previous],
          i = this.carouselService.slidesData[this.next],
          o = this.carouselService.settings.animateIn,
          s = this.carouselService.settings.animateOut;
        this.carouselService.current() !== this.previous &&
          (s &&
            ((r =
              +this.carouselService.coordinates(this.previous) -
              +this.carouselService.coordinates(this.next)),
            this.carouselService.slidesData.forEach((a) => {
              a.id === n.id &&
                ((a.left = `${r}px`),
                (a.isAnimated = !0),
                (a.isDefAnimatedOut = !0),
                (a.isCustomAnimatedOut = !0));
            })),
          o &&
            this.carouselService.slidesData.forEach((a) => {
              a.id === i.id &&
                ((a.isAnimated = !0),
                (a.isDefAnimatedIn = !0),
                (a.isCustomAnimatedIn = !0));
            }));
      }
      clear(r) {
        this.carouselService.slidesData.forEach((n) => {
          n.id === r &&
            ((n.left = ""),
            (n.isAnimated = !1),
            (n.isDefAnimatedOut = !1),
            (n.isCustomAnimatedOut = !1),
            (n.isDefAnimatedIn = !1),
            (n.isCustomAnimatedIn = !1),
            (n.classes = this.carouselService.setCurSlideClasses(n)));
        }),
          this.carouselService.onTransitionEnd();
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Xn));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  nC = (() => {
    class t {
      carouselService;
      autoHeightSubscription;
      constructor(r) {
        (this.carouselService = r), this.spyDataStreams();
      }
      ngOnDestroy() {
        this.autoHeightSubscription.unsubscribe();
      }
      spyDataStreams() {
        let r = this.carouselService.getInitializedState().pipe(
            N((s) => {
              this.carouselService.settings.autoHeight
                ? this.update()
                : this.carouselService.slidesData.forEach(
                    (a) => (a.heightState = "full")
                  );
            })
          ),
          n = this.carouselService.getChangedState().pipe(
            N((s) => {
              this.carouselService.settings.autoHeight &&
                s.property.name === "position" &&
                this.update();
            })
          ),
          i = this.carouselService.getRefreshedState().pipe(
            N((s) => {
              this.carouselService.settings.autoHeight && this.update();
            })
          ),
          o = Xt(r, n, i);
        this.autoHeightSubscription = o.subscribe(() => {});
      }
      update() {
        let r = this.carouselService.settings.items,
          n = this.carouselService.current(),
          i = n + r;
        this.carouselService.settings.center &&
          ((n = r % 2 === 1 ? n - (r - 1) / 2 : n - r / 2),
          (i = r % 2 === 1 ? n + r : n + r + 1)),
          this.carouselService.slidesData.forEach((o, s) => {
            o.heightState = s >= n && s < i ? "full" : "nulled";
          });
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Xn));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  rC = (() => {
    class t {
      carouselService;
      route;
      router;
      hashSubscription;
      currentHashFragment;
      constructor(r, n, i) {
        (this.carouselService = r),
          (this.route = n),
          (this.router = i),
          this.spyDataStreams(),
          this.route || (this.route = { fragment: P("no route").pipe(at(1)) }),
          this.router || (this.router = { navigate: (o, s) => {} });
      }
      ngOnDestroy() {
        this.hashSubscription.unsubscribe();
      }
      spyDataStreams() {
        let r = this.carouselService
            .getInitializedState()
            .pipe(N(() => this.listenToRoute())),
          n = this.carouselService.getChangedState().pipe(
            N((o) => {
              if (
                this.carouselService.settings.URLhashListener &&
                o.property.name === "position"
              ) {
                let s = this.carouselService.current(),
                  a = this.carouselService.slidesData[s].hashFragment;
                if (!a || a === this.currentHashFragment) return;
                this.router.navigate(["./"], {
                  fragment: a,
                  relativeTo: this.route,
                });
              }
            })
          ),
          i = Xt(r, n);
        this.hashSubscription = i.subscribe(() => {});
      }
      rewind(r) {
        let n = this.carouselService.slidesData.findIndex(
          (i) => i.hashFragment === r && i.isCloned === !1
        );
        n === -1 ||
          n === this.carouselService.current() ||
          this.carouselService.to(this.carouselService.relative(n), !1);
      }
      listenToRoute() {
        let r =
          this.carouselService.settings.startPosition === "URLHash" ? 0 : 2;
        this.route.fragment.pipe(Da(r)).subscribe((n) => {
          (this.currentHashFragment = n), this.rewind(n);
        });
      }
      static ɵfac = function (n) {
        return new (n || t)(w(Xn), w(We, 8), w(De, 8));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  FR = 0,
  gg = (() => {
    class t {
      tplRef;
      id = `owl-slide-${FR++}`;
      _dataMerge = 1;
      set dataMerge(r) {
        this._dataMerge = this.isNumeric(r) ? r : 1;
      }
      get dataMerge() {
        return this._dataMerge;
      }
      width = 0;
      dotContent = "";
      dataHash = "";
      constructor(r) {
        this.tplRef = r;
      }
      isNumeric(r) {
        return !isNaN(parseFloat(r));
      }
      static ɵfac = function (n) {
        return new (n || t)(y(Bn));
      };
      static ɵdir = ue({
        type: t,
        selectors: [["ng-template", "carouselSlide", ""]],
        inputs: {
          id: "id",
          dataMerge: "dataMerge",
          width: "width",
          dotContent: "dotContent",
          dataHash: "dataHash",
        },
      });
    }
    return t;
  })(),
  oC = (() => {
    class t {
      resizeObservable$;
      get onResize$() {
        return this.resizeObservable$;
      }
      constructor(r, n) {
        this.resizeObservable$ = Xo(n)
          ? wo(r, "resize")
          : new ce().asObservable();
      }
      static ɵfac = function (n) {
        return new (n || t)(w(hg), w(ft));
      };
      static ɵprov = _({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  kR = (() => {
    class t {
      zone;
      el;
      renderer;
      carouselService;
      animateService;
      owlDraggable;
      stageData;
      slidesData;
      listenerMouseMove;
      listenerTouchMove;
      listenerOneMouseMove;
      listenerOneTouchMove;
      listenerMouseUp;
      listenerTouchEnd;
      listenerOneClick;
      listenerATag;
      _drag = {
        time: null,
        target: null,
        pointer: null,
        stage: { start: null, current: null },
        direction: null,
        active: !1,
        moving: !1,
      };
      _oneDragMove$ = new ce();
      _oneMoveSubsription;
      preparePublicSlide = (r) => {
        let n = I({}, r);
        return delete n.tplRef, n;
      };
      constructor(r, n, i, o, s) {
        (this.zone = r),
          (this.el = n),
          (this.renderer = i),
          (this.carouselService = o),
          (this.animateService = s);
      }
      onMouseDown(r) {
        this.owlDraggable.isMouseDragable && this._onDragStart(r);
      }
      onTouchStart(r) {
        if (r.targetTouches.length >= 2) return !1;
        this.owlDraggable.isTouchDragable && this._onDragStart(r);
      }
      onTouchCancel(r) {
        this._onDragEnd(r);
      }
      onDragStart() {
        if (this.owlDraggable.isMouseDragable) return !1;
      }
      onSelectStart() {
        if (this.owlDraggable.isMouseDragable) return !1;
      }
      ngOnInit() {
        this._oneMoveSubsription = this._oneDragMove$
          .pipe(Ve())
          .subscribe(() => {
            this._sendChanges();
          });
      }
      ngOnDestroy() {
        this._oneMoveSubsription.unsubscribe();
      }
      bindOneMouseTouchMove = (r) => {
        this._oneMouseTouchMove(r);
      };
      bindOnDragMove = (r) => {
        this._onDragMove(r);
      };
      bindOnDragEnd = (r) => {
        this._onDragEnd(r);
      };
      _onDragStart(r) {
        let n = null;
        r.which !== 3 &&
          ((n = this._prepareDragging(r)),
          (this._drag.time = new Date().getTime()),
          (this._drag.target = r.target),
          (this._drag.stage.start = n),
          (this._drag.stage.current = n),
          (this._drag.pointer = this._pointer(r)),
          (this.listenerMouseUp = this.renderer.listen(
            document,
            "mouseup",
            this.bindOnDragEnd
          )),
          (this.listenerTouchEnd = this.renderer.listen(
            document,
            "touchend",
            this.bindOnDragEnd
          )),
          this.zone.runOutsideAngular(() => {
            (this.listenerOneMouseMove = this.renderer.listen(
              document,
              "mousemove",
              this.bindOneMouseTouchMove
            )),
              (this.listenerOneTouchMove = this.renderer.listen(
                document,
                "touchmove",
                this.bindOneMouseTouchMove
              ));
          }));
      }
      _oneMouseTouchMove(r) {
        let n = this._difference(this._drag.pointer, this._pointer(r));
        this.listenerATag && this.listenerATag(),
          !(Math.abs(n.x) < 3 && Math.abs(n.y) < 3 && this._is("valid")) &&
            ((Math.abs(n.x) < 3 &&
              Math.abs(n.x) < Math.abs(n.y) &&
              this._is("valid")) ||
              (this.listenerOneMouseMove(),
              this.listenerOneTouchMove(),
              (this._drag.moving = !0),
              this.blockClickAnchorInDragging(r),
              (this.listenerMouseMove = this.renderer.listen(
                document,
                "mousemove",
                this.bindOnDragMove
              )),
              (this.listenerTouchMove = this.renderer.listen(
                document,
                "touchmove",
                this.bindOnDragMove
              )),
              r.preventDefault(),
              this._enterDragging(),
              this._oneDragMove$.next(r)));
      }
      blockClickAnchorInDragging(r) {
        let n = r.target;
        for (; n && !(n instanceof HTMLAnchorElement); ) n = n.parentElement;
        n instanceof HTMLAnchorElement &&
          (this.listenerATag = this.renderer.listen(n, "click", () => !1));
      }
      _onDragMove(r) {
        let n,
          i = this.carouselService.defineNewCoordsDrag(r, this._drag);
        i !== !1 &&
          ((n = i),
          r.preventDefault(),
          (this._drag.stage.current = n),
          this._animate(n.x - this._drag.stage.start.x));
      }
      _animate(r) {
        this.renderer.setStyle(
          this.el.nativeElement.children[0],
          "transform",
          `translate3d(${r}px,0px,0px`
        ),
          this.renderer.setStyle(
            this.el.nativeElement.children[0],
            "transition",
            "0s"
          );
      }
      _onDragEnd(r) {
        (this.carouselService.owlDOMData.isGrab = !1),
          this.listenerOneMouseMove(),
          this.listenerOneTouchMove(),
          this._drag.moving &&
            (this.renderer.setStyle(
              this.el.nativeElement.children[0],
              "transform",
              ""
            ),
            this.renderer.setStyle(
              this.el.nativeElement.children[0],
              "transition",
              this.carouselService.speed(
                +this.carouselService.settings.dragEndSpeed ||
                  this.carouselService.settings.smartSpeed
              ) /
                1e3 +
                "s"
            ),
            this._finishDragging(r),
            this.listenerMouseMove(),
            this.listenerTouchMove()),
          (this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: { start: null, current: null },
            direction: null,
            active: !1,
            moving: !1,
          }),
          this.listenerMouseUp(),
          this.listenerTouchEnd();
      }
      _prepareDragging(r) {
        return this.carouselService.prepareDragging(r);
      }
      _oneClickHandler = () => {
        (this.listenerOneClick = this.renderer.listen(
          this._drag.target,
          "click",
          () => !1
        )),
          this.listenerOneClick();
      };
      _finishDragging(r) {
        this.carouselService.finishDragging(
          r,
          this._drag,
          this._oneClickHandler
        );
      }
      _pointer(r) {
        return this.carouselService.pointer(r);
      }
      _difference(r, n) {
        return this.carouselService.difference(r, n);
      }
      _is(r) {
        return this.carouselService.is(r);
      }
      _enter(r) {
        this.carouselService.enter(r);
      }
      _sendChanges() {
        this.carouselService.sendChanges();
      }
      onTransitionEnd() {
        this.carouselService.onTransitionEnd();
      }
      _enterDragging() {
        this.carouselService.enterDragging();
      }
      clear(r) {
        this.animateService.clear(r);
      }
      static ɵfac = function (n) {
        return new (n || t)(y(ee), y(He), y(bt), y(Xn), y(dg));
      };
      static ɵcmp = re({
        type: t,
        selectors: [["owl-stage"]],
        hostBindings: function (n, i) {
          n & 1 &&
            U("mousedown", function (s) {
              return i.onMouseDown(s);
            })("touchstart", function (s) {
              return i.onTouchStart(s);
            })("touchcancel", function (s) {
              return i.onTouchCancel(s);
            })("dragstart", function () {
              return i.onDragStart();
            })("selectstart", function () {
              return i.onSelectStart();
            });
        },
        inputs: {
          owlDraggable: "owlDraggable",
          stageData: "stageData",
          slidesData: "slidesData",
        },
        decls: 3,
        vars: 8,
        consts: [
          [1, "owl-stage", 3, "ngStyle", "transitionend"],
          [4, "ngFor", "ngForOf"],
          [1, "owl-item", 3, "ngClass", "ngStyle", "animationend"],
          [4, "ngIf"],
          [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
        ],
        template: function (n, i) {
          n & 1 &&
            (f(0, "div")(1, "div", 0),
            U("transitionend", function () {
              return i.onTransitionEnd();
            }),
            k(2, vR, 3, 9, "ng-container", 1),
            h()()),
            n & 2 &&
              (D(),
              M(
                "ngStyle",
                Kf(
                  2,
                  yR,
                  i.stageData.width + "px",
                  i.stageData.transform,
                  i.stageData.transition,
                  i.stageData.paddingL ? i.stageData.paddingL + "px" : "",
                  i.stageData.paddingR ? i.stageData.paddingR + "px" : ""
                )
              ),
              D(),
              M("ngForOf", i.slidesData));
        },
        dependencies: [Jo, Ge, Te, mD, gD],
        encapsulation: 2,
        data: {
          animation: [
            Nw("autoHeight", [
              Hh("nulled", eo({ height: 0 })),
              Hh("full", eo({ height: "*" })),
              zh("full => nulled", [Uh("700ms 350ms")]),
              zh("nulled => full", [Uh(350)]),
            ]),
          ],
        },
      });
    }
    return t;
  })(),
  sC = (() => {
    class t {
      el;
      resizeService;
      carouselService;
      navigationService;
      autoplayService;
      lazyLoadService;
      animateService;
      autoHeightService;
      hashService;
      logger;
      changeDetectorRef;
      slides;
      translated = new ae();
      dragging = new ae();
      change = new ae();
      changed = new ae();
      initialized = new ae();
      carouselWindowWidth;
      resizeSubscription;
      _allObservSubscription;
      _slidesChangesSubscription;
      owlDOMData;
      stageData;
      slidesData = [];
      navData;
      dotsData;
      slidesOutputData;
      carouselLoaded = !1;
      options;
      prevOptions;
      _viewCurSettings$;
      _translatedCarousel$;
      _draggingCarousel$;
      _changeCarousel$;
      _changedCarousel$;
      _initializedCarousel$;
      _carouselMerge$;
      docRef;
      constructor(r, n, i, o, s, a, l, c, u, d, p, g) {
        (this.el = r),
          (this.resizeService = n),
          (this.carouselService = i),
          (this.navigationService = o),
          (this.autoplayService = s),
          (this.lazyLoadService = a),
          (this.animateService = l),
          (this.autoHeightService = c),
          (this.hashService = u),
          (this.logger = d),
          (this.changeDetectorRef = p),
          (this.docRef = g);
      }
      onVisibilityChange(r) {
        if (this.carouselService.settings.autoplay)
          switch (this.docRef.visibilityState) {
            case "visible":
              !this.autoplayService.isAutoplayStopped &&
                this.autoplayService.play();
              break;
            case "hidden":
              this.autoplayService.pause();
              break;
            default:
              break;
          }
      }
      ngOnInit() {
        this.spyDataStreams(),
          (this.carouselWindowWidth =
            this.el.nativeElement.querySelector(".owl-carousel").clientWidth);
      }
      ngOnChanges() {
        this.prevOptions !== this.options &&
          (this.prevOptions && this.slides?.toArray().length
            ? (this.carouselService.setup(
                this.carouselWindowWidth,
                this.slides.toArray(),
                this.options
              ),
              this.carouselService.initialize(this.slides.toArray()))
            : this.prevOptions && !this.slides?.toArray().length
            ? ((this.carouselLoaded = !1),
              this.logger.log(
                "There are no slides to show. So the carousel won't be re-rendered"
              ))
            : (this.carouselLoaded = !1),
          (this.prevOptions = this.options));
      }
      ngAfterContentInit() {
        this.slides.toArray().length
          ? (this.carouselService.setup(
              this.carouselWindowWidth,
              this.slides.toArray(),
              this.options
            ),
            this.carouselService.initialize(this.slides.toArray()),
            this._winResizeWatcher())
          : this.logger.log(
              "There are no slides to show. So the carousel won't be rendered"
            ),
          (this._slidesChangesSubscription = this.slides.changes
            .pipe(
              N((r) => {
                this.carouselService.setup(
                  this.carouselWindowWidth,
                  r.toArray(),
                  this.options
                ),
                  this.carouselService.initialize(r.toArray()),
                  r.toArray().length || (this.carouselLoaded = !1),
                  r.toArray().length &&
                    !this.resizeSubscription &&
                    this._winResizeWatcher();
              })
            )
            .subscribe(() => {}));
      }
      ngOnDestroy() {
        this.resizeSubscription && this.resizeSubscription.unsubscribe(),
          this._slidesChangesSubscription &&
            this._slidesChangesSubscription.unsubscribe(),
          this._allObservSubscription &&
            this._allObservSubscription.unsubscribe();
      }
      spyDataStreams() {
        (this._viewCurSettings$ = this.carouselService
          .getViewCurSettings()
          .pipe(
            N((r) => {
              (this.owlDOMData = r.owlDOMData),
                (this.stageData = r.stageData),
                (this.slidesData = r.slidesData),
                this.carouselLoaded || (this.carouselLoaded = !0),
                (this.navData = r.navData),
                (this.dotsData = r.dotsData),
                this.changeDetectorRef.markForCheck();
            })
          )),
          (this._initializedCarousel$ = this.carouselService
            .getInitializedState()
            .pipe(
              N(() => {
                this.gatherTranslatedData(),
                  this.initialized.emit(this.slidesOutputData);
              })
            )),
          (this._translatedCarousel$ = this.carouselService
            .getTranslatedState()
            .pipe(
              N(() => {
                this.gatherTranslatedData(),
                  this.translated.emit(this.slidesOutputData);
              })
            )),
          (this._changeCarousel$ = this.carouselService.getChangeState().pipe(
            N(() => {
              this.gatherTranslatedData(),
                this.change.emit(this.slidesOutputData);
            })
          )),
          (this._changedCarousel$ = this.carouselService.getChangeState().pipe(
            je((r) => {
              let n = P(r).pipe(
                Oe(() => r.property.name === "position"),
                je(() => se(this.slidesData)),
                Da(r.property.value),
                at(this.carouselService.settings.items),
                F((i) => {
                  let o = this.carouselService.clonedIdPrefix,
                    s = i.id.indexOf(o) >= 0 ? i.id.slice(o.length) : i.id;
                  return te(I({}, i), { id: s, isActive: !0 });
                }),
                Nu(),
                F((i) => ({
                  slides: i,
                  startPosition: this.carouselService.relative(
                    r.property.value
                  ),
                }))
              );
              return Xt(n);
            }),
            N((r) => {
              this.gatherTranslatedData(),
                this.changed.emit(r.slides.length ? r : this.slidesOutputData);
            })
          )),
          (this._draggingCarousel$ = this.carouselService.getDragState().pipe(
            N(() => {
              this.gatherTranslatedData(),
                this.dragging.emit({
                  dragging: !0,
                  data: this.slidesOutputData,
                });
            }),
            je(() =>
              this.carouselService
                .getDraggedState()
                .pipe(F(() => !!this.carouselService.is("animating")))
            ),
            je((r) =>
              r
                ? this.carouselService.getTranslatedState().pipe(Ve())
                : P("not animating")
            ),
            N(() => {
              this.dragging.emit({ dragging: !1, data: this.slidesOutputData });
            })
          )),
          (this._carouselMerge$ = Xt(
            this._viewCurSettings$,
            this._translatedCarousel$,
            this._draggingCarousel$,
            this._changeCarousel$,
            this._changedCarousel$,
            this._initializedCarousel$
          )),
          (this._allObservSubscription = this._carouselMerge$.subscribe(
            () => {}
          ));
      }
      _winResizeWatcher() {
        Object.keys(this.carouselService._options.responsive).length &&
          (this.resizeSubscription = this.resizeService.onResize$
            .pipe(
              Oe(
                () =>
                  this.carouselWindowWidth !==
                  this.el.nativeElement.querySelector(".owl-carousel")
                    .clientWidth
              ),
              Pu(this.carouselService.settings.responsiveRefreshRate)
            )
            .subscribe(() => {
              this.carouselService.onResize(
                this.el.nativeElement.querySelector(".owl-carousel").clientWidth
              ),
                (this.carouselWindowWidth =
                  this.el.nativeElement.querySelector(
                    ".owl-carousel"
                  ).clientWidth);
            }));
      }
      onTransitionEnd() {
        this.carouselService.onTransitionEnd();
      }
      next() {
        this.carouselLoaded &&
          this.navigationService.next(this.carouselService.settings.navSpeed);
      }
      prev() {
        this.carouselLoaded &&
          this.navigationService.prev(this.carouselService.settings.navSpeed);
      }
      moveByDot(r) {
        this.carouselLoaded && this.navigationService.moveByDot(r);
      }
      to(r) {
        this.carouselLoaded && this.navigationService.toSlideById(r);
      }
      gatherTranslatedData() {
        let r,
          n = this.carouselService.clonedIdPrefix,
          i = this.slidesData
            .filter((o) => o.isActive === !0)
            .map((o) => ({
              id: o.id.indexOf(n) >= 0 ? o.id.slice(n.length) : o.id,
              width: o.width,
              marginL: o.marginL,
              marginR: o.marginR,
              center: o.isCentered,
            }));
        (r = this.carouselService.relative(this.carouselService.current())),
          (this.slidesOutputData = { startPosition: r, slides: i });
      }
      startPausing() {
        this.autoplayService.startPausing();
      }
      startPlayML() {
        this.autoplayService.startPlayingMouseLeave();
      }
      startPlayTE() {
        this.autoplayService.startPlayingTouchEnd();
      }
      stopAutoplay() {
        (this.autoplayService.isAutoplayStopped = !0),
          this.autoplayService.stop();
      }
      startAutoplay() {
        (this.autoplayService.isAutoplayStopped = !1),
          this.autoplayService.play();
      }
      static ɵfac = function (n) {
        return new (n || t)(
          y(He),
          y(oC),
          y(Xn),
          y(Xb),
          y(eC),
          y(tC),
          y(dg),
          y(nC),
          y(rC),
          y(fg),
          y(En),
          y(pg)
        );
      };
      static ɵcmp = re({
        type: t,
        selectors: [["owl-carousel-o"]],
        contentQueries: function (n, i, o) {
          if ((n & 1 && Pl(o, gg, 4), n & 2)) {
            let s;
            Rl((s = Fl())) && (i.slides = s);
          }
        },
        hostBindings: function (n, i) {
          n & 1 &&
            U(
              "visibilitychange",
              function (s) {
                return i.onVisibilityChange(s);
              },
              !1,
              My
            );
        },
        inputs: { options: "options" },
        outputs: {
          translated: "translated",
          dragging: "dragging",
          change: "change",
          changed: "changed",
          initialized: "initialized",
        },
        features: [Me([Xb, eC, Xn, tC, dg, nC, rC]), Dt],
        decls: 4,
        vars: 9,
        consts: [
          [
            1,
            "owl-carousel",
            "owl-theme",
            3,
            "ngClass",
            "mouseover",
            "mouseleave",
            "touchstart",
            "touchend",
          ],
          ["owlCarousel", ""],
          ["class", "owl-stage-outer", 4, "ngIf"],
          [4, "ngIf"],
          [1, "owl-stage-outer"],
          [3, "owlDraggable", "stageData", "slidesData"],
          [1, "owl-nav", 3, "ngClass"],
          [1, "owl-prev", 3, "ngClass", "innerHTML", "click"],
          [1, "owl-next", 3, "ngClass", "innerHTML", "click"],
          [1, "owl-dots", 3, "ngClass"],
          ["class", "owl-dot", 3, "ngClass", "click", 4, "ngFor", "ngForOf"],
          [1, "owl-dot", 3, "ngClass", "click"],
          [3, "innerHTML"],
        ],
        template: function (n, i) {
          n & 1 &&
            (f(0, "div", 0, 1),
            U("mouseover", function () {
              return i.startPausing();
            })("mouseleave", function () {
              return i.startPlayML();
            })("touchstart", function () {
              return i.startPausing();
            })("touchend", function () {
              return i.startPlayTE();
            }),
            k(2, wR, 2, 6, "div", 2)(3, _R, 6, 15, "ng-container", 3),
            h()),
            n & 2 &&
              (M(
                "ngClass",
                Kf(
                  3,
                  ER,
                  i.owlDOMData == null ? null : i.owlDOMData.rtl,
                  i.owlDOMData == null ? null : i.owlDOMData.isLoaded,
                  i.owlDOMData == null ? null : i.owlDOMData.isResponsive,
                  i.owlDOMData == null ? null : i.owlDOMData.isMouseDragable,
                  i.owlDOMData == null ? null : i.owlDOMData.isGrab
                )
              ),
              D(2),
              M("ngIf", i.carouselLoaded),
              D(),
              M("ngIf", i.slides.toArray().length));
        },
        dependencies: [Jo, Ge, Te, kR],
        styles: [".owl-theme[_ngcontent-%COMP%]{display:block}"],
        changeDetection: 0,
      });
    }
    return t;
  })();
var aC = (() => {
  class t {
    static ɵfac = function (n) {
      return new (n || t)();
    };
    static ɵmod = Fe({ type: t });
    static ɵinj = ke({ providers: [xR, oC, RR, fg], imports: [tc] });
  }
  return t;
})();
var VR = (t) => ["/products/details", t];
function jR(t, e) {
  if (
    (t & 1 &&
      (f(0, "div", 3)(1, "div", 4),
      E(2, "img", 5),
      f(3, "div", 6)(4, "a", 7)(5, "h5", 8),
      m(6),
      h(),
      f(7, "p", 9),
      m(8, "Purchase for "),
      f(9, "strong"),
      m(10),
      Et(11, "currency"),
      h()()()()()()),
    t & 2)
  ) {
    let r = fe().$implicit;
    D(2),
      M("src", r.imageUrl, wt),
      D(2),
      M("routerLink", ln(9, VR, r.productId)),
      D(2),
      me("", r.name, " now on sale!"),
      D(4),
      Le(Ht(11, 4, r.price, "USD", "symbol", "1.2-2"));
  }
}
function $R(t, e) {
  t & 1 && ($i(0), k(1, jR, 12, 11, "ng-template", 2), Bi());
}
var au = (() => {
  let e = class e {
    constructor(n) {
      (this.carouselService = n),
        (this.title = "On Sale Products"),
        (this.customOptions = {
          loop: !0,
          autoplay: !0,
          mouseDrag: !1,
          touchDrag: !1,
          pullDrag: !1,
          dots: !1,
          navSpeed: 700,
          navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>',
          ],
          responsive: {
            0: { items: 1 },
            400: { items: 2 },
            740: { items: 3 },
            940: { items: 3 },
          },
          nav: !0,
        });
    }
    ngOnInit() {
      this.carouselService.getProducts().subscribe((n) => {
        this.images = n;
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(po));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-carousel"]],
      features: [Me([po])],
      decls: 2,
      vars: 2,
      consts: [
        [1, "owl-theme", 3, "options"],
        [4, "ngFor", "ngForOf"],
        ["carouselSlide", ""],
        [1, "item"],
        [1, "card", "h-100"],
        ["alt", "Product Image", 1, "card-img-top", "rounded", 3, "src"],
        [1, "carousel-caption", "d-none", "d-md-block", "alert", "alert-light"],
        [
          1,
          "link-success",
          "link-offset-2",
          "link-underline-opacity-25",
          "link-underline-opacity-100-hover",
          3,
          "routerLink",
        ],
        [1, "card-title"],
        [1, "card-text"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "owl-carousel-o", 0), k(1, $R, 2, 0, "ng-container", 1), h()),
          i & 2 && (M("options", o.customOptions), D(), M("ngForOf", o.images));
      },
      dependencies: [Ge, et, sC, gg, Mn],
      styles: [
        ".owl-carousel[_ngcontent-%COMP%]   .owl-item[_ngcontent-%COMP%]{margin-right:0}.card[_ngcontent-%COMP%]{margin:10px}img[_ngcontent-%COMP%]{width:250px;height:250px;object-fit:cover}.carousel-caption[_ngcontent-%COMP%]{background-color:#12d18880;padding:10px}.carousel-caption[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%], .carousel-caption[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff67a}.caption[_ngcontent-%COMP%]{margin-left:30%}",
      ],
    }));
  let t = e;
  return t;
})();
function UR(t, e) {
  if ((t & 1 && (f(0, "a", 4), m(1), h()), t & 2)) {
    let r = e.$implicit;
    Wf("routerLink", "/products/category/", r.id, ""), D(), me("", r.name, " ");
  }
}
var lu = (() => {
  let e = class e {
    constructor(n) {
      (this.categoryService = n), (this.title = "Category List");
    }
    ngOnInit() {
      this.categoryService.getProducts().subscribe((n) => {
        this.categories = n;
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Zt));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-category"]],
      features: [Me([Zt])],
      decls: 6,
      vars: 1,
      consts: [
        [1, "nav-scroller", "py-1", "mb-3", "border-bottom"],
        [1, "nav", "nav-underline"],
        [
          "routerLink",
          "/products/",
          1,
          "nav-item",
          "nav-link",
          "link-body-emphasis",
        ],
        [
          "class",
          "nav-item nav-link link-body-emphasis",
          3,
          "routerLink",
          4,
          "ngFor",
          "ngForOf",
        ],
        [1, "nav-item", "nav-link", "link-body-emphasis", 3, "routerLink"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "div", 0)(1, "nav", 1)(2, "a", 2),
          m(3, "All Products"),
          h(),
          k(4, UR, 2, 2, "a", 3),
          h(),
          E(5, "app-carousel"),
          h()),
          i & 2 && (D(4), M("ngForOf", o.categories));
      },
      dependencies: [Ge, et, au],
    }));
  let t = e;
  return t;
})();
var cC = (() => {
  let e = class e {
    transform(n, i) {
      return (
        (i = i ? i.toLocaleLowerCase() : ""),
        i ? n.filter((o) => o.name.toLocaleLowerCase().indexOf(i) !== -1) : n
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵpipe = Lo({ name: "productFilter", type: e, pure: !0 }));
  let t = e;
  return t;
})();
function zR(t, e) {
  if (
    (t & 1 &&
      (f(0, "div", 7),
      m(1, "Search results for "),
      f(2, "strong"),
      m(3),
      h()()),
    t & 2)
  ) {
    let r = fe();
    D(3), Le(r.filterText);
  }
}
function qR(t, e) {
  t & 1 &&
    (f(0, "div", 8), m(1, " No products available in this category "), h());
}
var GR = (t) => ["/products/details", t];
function WR(t, e) {
  if (t & 1) {
    let r = Je();
    f(0, "div", 9)(1, "div", 10)(2, "div", 11),
      E(3, "img", 12),
      h(),
      f(4, "div", 13)(5, "h5", 14),
      m(6),
      Et(7, "currency"),
      h(),
      f(8, "p", 15)(9, "span", 16),
      m(10),
      h()()(),
      f(11, "div", 17)(12, "a", 18),
      U("click", function () {
        let o = xe(r).$implicit,
          s = fe();
        return Ae(s.addToCart(o));
      }),
      m(13, "Add to cart"),
      h(),
      f(14, "a", 19),
      m(15, "Details"),
      h()()()();
  }
  if (t & 2) {
    let r = e.$implicit;
    D(3),
      M("src", r.imageUrl, wt),
      D(3),
      Qf("", r.name, " - ", Ht(7, 5, r.price, "USD", "symbol", "1.2-2"), ""),
      D(4),
      Le(r.description),
      D(4),
      M("routerLink", ln(10, GR, r.id));
  }
}
var mg = (() => {
  let e = class e {
    constructor(n, i, o, s, a) {
      (this.alertifyService = n),
        (this.cartService = i),
        (this.productService = o),
        (this.activatedRoute = s),
        (this.router = a),
        (this.title = "Product List"),
        (this.filterText = "");
    }
    ngOnInit() {
      this.activatedRoute.params.subscribe((n) => {
        this.productService.getProducts(n.categoryId).subscribe((i) => {
          this.products = i;
        });
      });
    }
    addToCart(n) {
      this.cartService.addToCart(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Be), y(Mr), y(Yt), y(We), y(De));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-product"]],
      inputs: { selectedProduct: "selectedProduct" },
      features: [Me([Be, Yt])],
      decls: 10,
      vars: 6,
      consts: [
        [1, "form-group", "searchbar"],
        [1, "mb-3"],
        [
          "id",
          "productName",
          "placeholder",
          "Enter your search text",
          1,
          "form-control",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["class", "form-text", 4, "ngIf"],
        [1, "row", "row-cols-md-3", "g-4", "page", "rounded"],
        ["noProduct", ""],
        [
          "class",
          "col-md-4 mb-3 justify-content-evenly",
          4,
          "ngFor",
          "ngForOf",
        ],
        [1, "form-text"],
        ["role", "alert", 1, "alert", "alert-primary"],
        [1, "col-md-4", "mb-3", "justify-content-evenly"],
        [1, "card", "productbox", "h-100", "border-0", "rounded"],
        [1, "d-flex", "justify-content-center"],
        ["alt", "...", 1, "card-img-top", "border", "border-cyan", 3, "src"],
        [1, "card-body"],
        [1, "card-title"],
        [1, "card-text"],
        [1, "d-inline-block", "text-truncate", 2, "max-width", "100%"],
        [
          1,
          "card-footer",
          "d-flex",
          "flex-column",
          "flex-sm-row",
          "justify-content-center",
          "justify-content-sm-between",
          "align-items-center",
        ],
        [1, "btn", "btn-primary", "text-white", "mb-2", "mb-sm-0", 3, "click"],
        [
          "routerLinkActive",
          "active",
          1,
          "btn",
          "btn-secondary",
          3,
          "routerLink",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (E(0, "app-category"),
          f(1, "div", 0)(2, "div", 1)(3, "input", 2),
          qe("ngModelChange", function (a) {
            return Xe(o.filterText, a) || (o.filterText = a), a;
          }),
          h(),
          k(4, zR, 4, 1, "div", 3),
          h()(),
          f(5, "div", 4),
          k(6, qR, 2, 0, "ng-template", null, 5, L0)(8, WR, 16, 12, "div", 6),
          Et(9, "productFilter"),
          h()),
          i & 2 &&
            (D(3),
            ze("ngModel", o.filterText),
            D(),
            M("ngIf", o.filterText),
            D(4),
            M("ngForOf", Ll(9, 3, o.products, o.filterText)));
      },
      dependencies: [Ge, Te, et, Qb, It, Gt, un, lu, Mn, cC],
      styles: [
        ".productbox[_ngcontent-%COMP%]{padding:15px;width:80%;height:80%}.searchbar[_ngcontent-%COMP%]{padding:10px}.page[_ngcontent-%COMP%]{background-color:#e6e1e18e;padding-left:75px}img[_ngcontent-%COMP%]{width:250px;height:250px;object-fit:cover}.text-truncate[_ngcontent-%COMP%]{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}",
      ],
    }));
  let t = e;
  return t;
})();
var go = class {};
function QR(t, e) {
  t & 1 && (f(0, "div", 16), m(1, " \xDCr\xFCn ismi gereklidir. "), h());
}
function KR(t, e) {
  t & 1 && (f(0, "div", 16), m(1, " A\xE7\u0131klama gereklidir. "), h());
}
function YR(t, e) {
  t & 1 && (f(0, "div", 16), m(1, " \xDCr\xFCn resmi gereklidir. "), h());
}
function ZR(t, e) {
  t & 1 && (f(0, "div", 16), m(1, " \xDCr\xFCn fiyat\u0131 gereklidir. "), h());
}
function JR(t, e) {
  if ((t & 1 && (f(0, "option", 17), m(1), h()), t & 2)) {
    let r = e.$implicit;
    M("value", r.id), D(), me(" ", r.name, " ");
  }
}
function XR(t, e) {
  t & 1 && (f(0, "div", 16), m(1, " Kategori gereklidir. "), h());
}
var uC = (() => {
  let e = class e {
    constructor(n, i, o) {
      (this.categoryService = n),
        (this.productService = i),
        (this.alertifyService = o),
        (this.model = new go());
    }
    ngOnInit() {
      this.categoryService.getProducts().subscribe((n) => {
        this.categories = n;
      });
    }
    add(n) {
      this.productService.addProduct(this.model).subscribe((i) => {
        this.alertifyService.success(i.name + " added successfully");
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Zt), y(Yt), y(Be));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-product-add-forms1"]],
      features: [Me([Zt, Yt])],
      decls: 27,
      vars: 12,
      consts: [
        [3, "ngSubmit"],
        ["productAddForm", "ngForm"],
        [1, "mb-3"],
        [
          "type",
          "text",
          "placeholder",
          "\xDCr\xFCn Ad\u0131",
          "name",
          "name",
          "id",
          "name",
          "required",
          "",
          1,
          "form-control",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["name", "ngModel"],
        ["class", "alert alert-danger", 4, "ngIf"],
        [
          "type",
          "text",
          "placeholder",
          "A\xE7\u0131klama",
          "name",
          "description",
          "id",
          "description",
          "required",
          "",
          1,
          "form-control",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["description", "ngModel"],
        [
          "type",
          "text",
          "placeholder",
          "\xDCr\xFCn resmi",
          "name",
          "imageUrl",
          "id",
          "imageUrl",
          "required",
          "",
          1,
          "form-control",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["imageUrl", "ngModel"],
        [
          "type",
          "text",
          "placeholder",
          "Fiyat",
          "name",
          "price",
          "id",
          "price",
          "required",
          "",
          1,
          "form-control",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["price", "ngModel"],
        [
          "required",
          "",
          "name",
          "categoryId",
          "id",
          "categoryId",
          1,
          "form-select",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["categoryId", "ngModel"],
        [3, "value", 4, "ngFor", "ngForOf"],
        ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
        [1, "alert", "alert-danger"],
        [3, "value"],
      ],
      template: function (i, o) {
        if (i & 1) {
          let s = Je();
          f(0, "h3"),
            m(1, "Yeni \xFCr\xFCn ekle"),
            h(),
            f(2, "form", 0, 1),
            U("ngSubmit", function () {
              xe(s);
              let l = _t(3);
              return Ae(o.add(l));
            }),
            f(4, "div", 2)(5, "input", 3, 4),
            qe("ngModelChange", function (l) {
              return Xe(o.model.name, l) || (o.model.name = l), l;
            }),
            h(),
            k(7, QR, 2, 0, "div", 5),
            h(),
            f(8, "div", 2)(9, "input", 6, 7),
            qe("ngModelChange", function (l) {
              return Xe(o.model.description, l) || (o.model.description = l), l;
            }),
            h(),
            k(11, KR, 2, 0, "div", 5),
            h(),
            f(12, "div", 2)(13, "input", 8, 9),
            qe("ngModelChange", function (l) {
              return Xe(o.model.imageUrl, l) || (o.model.imageUrl = l), l;
            }),
            h(),
            k(15, YR, 2, 0, "div", 5),
            h(),
            f(16, "div", 2)(17, "input", 10, 11),
            qe("ngModelChange", function (l) {
              return Xe(o.model.price, l) || (o.model.price = l), l;
            }),
            h(),
            k(19, ZR, 2, 0, "div", 5),
            h(),
            f(20, "div", 2)(21, "select", 12, 13),
            qe("ngModelChange", function (l) {
              return Xe(o.model.categoryId, l) || (o.model.categoryId = l), l;
            }),
            k(23, JR, 2, 2, "option", 14),
            h(),
            k(24, XR, 2, 0, "div", 5),
            h(),
            f(25, "button", 15),
            m(26, "\xDCr\xFCn Ekle"),
            h()();
        }
        if (i & 2) {
          let s = _t(3),
            a = _t(6),
            l = _t(10),
            c = _t(14),
            u = _t(18),
            d = _t(22);
          D(5),
            ze("ngModel", o.model.name),
            D(2),
            M("ngIf", a.invalid && a.dirty),
            D(2),
            ze("ngModel", o.model.description),
            D(2),
            M("ngIf", l.invalid && l.dirty),
            D(2),
            ze("ngModel", o.model.imageUrl),
            D(2),
            M("ngIf", c.invalid && c.dirty),
            D(2),
            ze("ngModel", o.model.price),
            D(2),
            M("ngIf", u.invalid && u.dirty),
            D(2),
            ze("ngModel", o.model.categoryId),
            D(2),
            M("ngForOf", o.categories),
            D(),
            M("ngIf", d.invalid && d.touched),
            D(),
            M("disabled", s.invalid);
        }
      },
      dependencies: [Ge, Te, Dr, Zi, Ji, It, Yi, Gt, yr, Zn, un, ri],
    }));
  let t = e;
  return t;
})();
function eF(t, e) {
  t & 1 && (f(0, "div", 11), m(1, " \xDCr\xFCn ad\u0131 zorunludur. "), h());
}
function tF(t, e) {
  t & 1 && (f(0, "div", 11), m(1, " A\xE7\u0131klama zorunludur. "), h());
}
function nF(t, e) {
  t & 1 && (f(0, "div", 11), m(1, " Fiyat zorunludur. "), h());
}
function rF(t, e) {
  t & 1 && (f(0, "div", 11), m(1, " Foto\u011Fraf zorunludur. "), h());
}
function iF(t, e) {
  if ((t & 1 && (f(0, "option", 12), m(1), h()), t & 2)) {
    let r = e.$implicit;
    M("value", r.id), D(), me(" ", r.name, " ");
  }
}
function oF(t, e) {
  t & 1 && (f(0, "div", 13), m(1, " Kategori gereklidir. "), h());
}
var dC = (() => {
  let e = class e {
    constructor(n, i, o, s) {
      (this.formBuilder = n),
        (this.categoryService = i),
        (this.productService = o),
        (this.alertifyService = s),
        (this.product = new go());
    }
    createProductAddForm() {
      this.productAddForm = this.formBuilder.group({
        name: ["", vr.required],
        description: ["", vr.required],
        imageUrl: ["", vr.required],
        price: ["", vr.required],
        categoryId: ["", vr.required],
      });
    }
    ngOnInit() {
      this.createProductAddForm(),
        this.categoryService.getProducts().subscribe((n) => {
          this.categories = n;
        });
    }
    add() {
      this.productAddForm.valid &&
        (this.product = Object.assign({}, this.productAddForm.value)),
        this.productService.addProduct(this.product).subscribe((n) => {
          this.alertifyService.success(n.name + " added successfully");
        });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Tw), y(Zt), y(Yt), y(Be));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-product-add-forms2"]],
      features: [Me([Zt, Yt])],
      decls: 21,
      vars: 8,
      consts: [
        [3, "formGroup", "ngSubmit"],
        [1, "mb-3"],
        [
          "type",
          "text",
          "name",
          "name",
          "id",
          "name",
          "formControlName",
          "name",
          "placeholder",
          "\xDCr\xFCn Ad\u0131",
          1,
          "form-control",
        ],
        ["class", "alert alert-danger px-2 py-2", 4, "ngIf"],
        [
          "type",
          "text",
          "name",
          "description",
          "id",
          "description",
          "formControlName",
          "description",
          "placeholder",
          "A\xE7\u0131klama",
          1,
          "form-control",
        ],
        [
          "type",
          "text",
          "name",
          "price",
          "id",
          "price",
          "formControlName",
          "price",
          "placeholder",
          "Fiyat",
          1,
          "form-control",
        ],
        [
          "type",
          "text",
          "name",
          "imageUrl",
          "id",
          "imageUrl",
          "formControlName",
          "imageUrl",
          "placeholder",
          "\xDCr\xFCn Resmi",
          1,
          "form-control",
        ],
        [
          "formControlName",
          "categoryId",
          "required",
          "",
          "name",
          "categoryId",
          "id",
          "categoryId",
          1,
          "form-select",
        ],
        [3, "value", 4, "ngFor", "ngForOf"],
        ["class", "alert alert-danger", 4, "ngIf"],
        ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
        [1, "alert", "alert-danger", "px-2", "py-2"],
        [3, "value"],
        [1, "alert", "alert-danger"],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (f(0, "h3"),
            m(1, "Yeni \xDCr\xFCn Ekle - Reactive"),
            h(),
            f(2, "form", 0),
            U("ngSubmit", function () {
              return o.add();
            }),
            f(3, "div", 1),
            E(4, "input", 2),
            k(5, eF, 2, 0, "div", 3),
            h(),
            f(6, "div", 1),
            E(7, "input", 4),
            k(8, tF, 2, 0, "div", 3),
            h(),
            f(9, "div", 1),
            E(10, "input", 5),
            k(11, nF, 2, 0, "div", 3),
            h(),
            f(12, "div", 1),
            E(13, "input", 6),
            k(14, rF, 2, 0, "div", 3),
            h(),
            f(15, "div", 1)(16, "select", 7),
            k(17, iF, 2, 2, "option", 8),
            h(),
            k(18, oF, 2, 0, "div", 9),
            h(),
            f(19, "button", 10),
            m(20, "\xDCr\xFCn Ekle"),
            h()()),
          i & 2)
        ) {
          let s, a, l, c, u;
          D(2),
            M("formGroup", o.productAddForm),
            D(3),
            M(
              "ngIf",
              (o.productAddForm == null ||
              (s = o.productAddForm.get("name")) == null
                ? null
                : s.hasError("required")) &&
                (o.productAddForm == null ||
                (s = o.productAddForm.get("name")) == null
                  ? null
                  : s.dirty)
            ),
            D(3),
            M(
              "ngIf",
              (o.productAddForm == null ||
              (a = o.productAddForm.get("description")) == null
                ? null
                : a.hasError("required")) &&
                (o.productAddForm == null ||
                (a = o.productAddForm.get("description")) == null
                  ? null
                  : a.dirty)
            ),
            D(3),
            M(
              "ngIf",
              (o.productAddForm == null ||
              (l = o.productAddForm.get("price")) == null
                ? null
                : l.hasError("required")) &&
                (o.productAddForm == null ||
                (l = o.productAddForm.get("price")) == null
                  ? null
                  : l.dirty)
            ),
            D(3),
            M(
              "ngIf",
              (o.productAddForm == null ||
              (c = o.productAddForm.get("imageUrl")) == null
                ? null
                : c.hasError("required")) &&
                (o.productAddForm == null ||
                (c = o.productAddForm.get("imageUrl")) == null
                  ? null
                  : c.dirty)
            ),
            D(3),
            M("ngForOf", o.categories),
            D(),
            M(
              "ngIf",
              (o.productAddForm == null ||
              (u = o.productAddForm.get("categoryId")) == null
                ? null
                : u.hasError("required")) &&
                (o.productAddForm == null ||
                (u = o.productAddForm.get("categoryId")) == null
                  ? null
                  : u.touched)
            ),
            D(),
            M("disabled", o.productAddForm.invalid);
        }
      },
      dependencies: [Ge, Te, Dr, Zi, Ji, It, Yi, Gt, yr, Zn, $h, Bh],
    }));
  let t = e;
  return t;
})();
var cu = class {};
var Mt = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.apiUrl = "https://ulassahillioglu.pythonanywhere.com/"),
        (this.loggedIn = !1),
        (this._isAdmin = !1),
        (this.loggedIn = !!localStorage.getItem("token"));
    }
    checkSuperuser() {
      let n = localStorage.getItem("token"),
        o = { headers: new qt({ Authorization: `Token ${n}` }) };
      return this.http.get(`${this.apiUrl}is_superuser/`, o);
    }
    checkAdmin() {
      return this._isAdmin;
    }
    isLoggedIn() {
      return this.loggedIn;
    }
    signup(n) {
      let i = n.username,
        o = n.password,
        s = n.email;
      return this.http
        .post(`${this.apiUrl}signup/`, { username: i, password: o, email: s })
        .pipe(
          F((a) => {
            console.log(
              `Registration for user ${a.user.username} is successful`
            );
          })
        );
    }
    login(n) {
      let i = n.username,
        o = n.password;
      return this.http
        .post(`${this.apiUrl}login/`, { username: i, password: o })
        .pipe(
          F(
            (s) => (
              (this.loggedIn = !0),
              (this._isAdmin = s.user.is_superuser),
              localStorage.setItem("user_id", s.user.id),
              localStorage.setItem("user", s.user.is_superuser),
              localStorage.setItem("token", s.token),
              s
            )
          )
        );
    }
    logOut() {
      localStorage.removeItem("token"),
        (this.loggedIn = !1),
        (this._isAdmin = !1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(pt));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function sF(t, e) {
  if ((t & 1 && (f(0, "div", 27), m(1), h()), t & 2)) {
    let r = fe();
    D(), Le(r.errorMessage);
  }
}
var fC = (() => {
  let e = class e {
    constructor(n, i, o, s) {
      (this.accountService = n),
        (this.router = i),
        (this.route = o),
        (this.alertifyService = s),
        (this.model = new cu()),
        (this.errorMessage = "");
    }
    login(n) {
      n.valid
        ? (console.log("Attempting login with username:", this.model.username),
          this.accountService
            .login(this.model)
            .pipe(Ve())
            .subscribe({
              next: (i) => {
                console.log("Login successful:", i),
                  localStorage.setItem("token", i.token);
                let o = this.route.snapshot.queryParams.returnUrl || "/";
                this.router.navigateByUrl(o);
              },
              error: (i) => {
                console.error("Error during login:", i),
                  this.alertifyService.error("Invalid username or password.");
              },
            }))
        : (this.errorMessage = "Please fill in all fields");
    }
    ngOnInit() {
      this.accountService.checkSuperuser();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Mt), y(De), y(We), y(Be));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-login"]],
      decls: 34,
      vars: 3,
      consts: [
        [1, "limiter"],
        [1, "container-login100"],
        [1, "wrap-login100"],
        ["data-tilt", "", 1, "login100-pic", "js-tilt"],
        ["src", "assets/images/img-01.png", "alt", "IMG"],
        [1, "login100-form", "validate-form", 3, "ngSubmit"],
        ["loginForm", "ngForm"],
        [1, "login100-form-title"],
        [1, "wrap-input100", "validate-input"],
        [
          "type",
          "text",
          "id",
          "username",
          "name",
          "username",
          "placeholder",
          "Username",
          "required",
          "",
          "autofocus",
          "",
          1,
          "input100",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["username", "ngModel"],
        [1, "focus-input100"],
        [1, "symbol-input100"],
        ["aria-hidden", "true", 1, "fa", "fa-envelope"],
        [
          "data-validate",
          "Password is required",
          1,
          "wrap-input100",
          "validate-input",
        ],
        [
          "type",
          "password",
          "id",
          "pass",
          "name",
          "pass",
          "placeholder",
          "Password",
          1,
          "input100",
          3,
          "ngModel",
          "ngModelChange",
        ],
        ["password", "ngModel"],
        ["aria-hidden", "true", 1, "fa", "fa-lock"],
        ["class", "alert alert-danger", 4, "ngIf"],
        [1, "container-login100-form-btn"],
        [1, "login100-form-btn"],
        [1, "text-center", "p-t-12"],
        [1, "txt1"],
        ["href", "#", 1, "txt2"],
        [1, "text-center", "p-t-136"],
        ["routerLink", "/signup", 1, "txt2"],
        ["aria-hidden", "true", 1, "fa", "fa-long-arrow-right", "m-l-5"],
        [1, "alert", "alert-danger"],
      ],
      template: function (i, o) {
        if (i & 1) {
          let s = Je();
          f(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3),
            E(4, "img", 4),
            h(),
            f(5, "form", 5, 6),
            U("ngSubmit", function () {
              xe(s);
              let l = _t(6);
              return Ae(o.login(l));
            }),
            f(7, "span", 7),
            m(8, " Login "),
            h(),
            f(9, "div", 8)(10, "input", 9, 10),
            qe("ngModelChange", function (l) {
              return Xe(o.model.username, l) || (o.model.username = l), l;
            }),
            h(),
            E(12, "span", 11),
            f(13, "span", 12),
            E(14, "i", 13),
            h()(),
            f(15, "div", 14)(16, "input", 15, 16),
            qe("ngModelChange", function (l) {
              return Xe(o.model.password, l) || (o.model.password = l), l;
            }),
            h(),
            E(18, "span", 11),
            f(19, "span", 12),
            E(20, "i", 17),
            h()(),
            k(21, sF, 2, 1, "div", 18),
            f(22, "div", 19)(23, "button", 20),
            m(24, " Login "),
            h()(),
            f(25, "div", 21)(26, "span", 22),
            m(27, " Forgot "),
            h(),
            f(28, "a", 23),
            m(29, " Username / Password? "),
            h()(),
            f(30, "div", 24)(31, "a", 25),
            m(32, " Create your Account "),
            E(33, "i", 26),
            h()()()()()();
        }
        i & 2 &&
          (D(10),
          ze("ngModel", o.model.username),
          D(6),
          ze("ngModel", o.model.password),
          D(5),
          M("ngIf", o.errorMessage));
      },
      dependencies: [Te, et, Dr, It, Gt, yr, Zn, un, ri],
      styles: [
        "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}body[_ngcontent-%COMP%]{font-family:Arial,sans-serif;background-color:#f4f4f4}.limiter[_ngcontent-%COMP%]{width:100%;margin:0 auto}.container-login100[_ngcontent-%COMP%]{width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background-color:#f4f4f4}.wrap-login100[_ngcontent-%COMP%]{width:100%;max-width:400px;background:#fff;border-radius:10px;overflow:hidden;padding:50px;box-shadow:0 10px 30px #0000001a}.login100-pic[_ngcontent-%COMP%]{text-align:center;margin-bottom:30px}.login100-pic[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:100%}.login100-form-title[_ngcontent-%COMP%]{font-family:Arial,sans-serif;font-size:24px;color:#333;text-align:center;margin-bottom:30px}.wrap-input100[_ngcontent-%COMP%]{position:relative;width:100%;margin-bottom:20px}.input100[_ngcontent-%COMP%]{font-family:Arial,sans-serif;font-size:16px;color:#666;line-height:1.2;width:100%;padding:15px;border:1px solid #ccc;border-radius:5px;transition:border-color .3s}.input100[_ngcontent-%COMP%]:focus{border-color:#ccc}.focus-input100[_ngcontent-%COMP%]:before{background:none}.focus-input100[_ngcontent-%COMP%]:after{color:#999}.input100[_ngcontent-%COMP%]:focus + .focus-input100[_ngcontent-%COMP%]:before{visibility:visible;height:100%}.input100[_ngcontent-%COMP%]:focus + .focus-input100[_ngcontent-%COMP%]:after{color:#007bff}.login100-form-btn[_ngcontent-%COMP%]{font-family:Arial,sans-serif;font-size:16px;color:#fff;line-height:1.2;text-transform:uppercase;width:100%;height:50px;border:none;border-radius:5px;background:#007bff;cursor:pointer;transition:background .3s}.login100-form-btn[_ngcontent-%COMP%]:hover{background:#0056b3}.text-center[_ngcontent-%COMP%]{text-align:center}.p-t-12[_ngcontent-%COMP%]{padding-top:12px}.p-t-136[_ngcontent-%COMP%]{padding-top:136px}.txt1[_ngcontent-%COMP%]{font-size:14px;color:#999}.txt2[_ngcontent-%COMP%]{font-size:14px;color:#007bff;text-decoration:none}.txt2[_ngcontent-%COMP%]:hover{text-decoration:underline}.alert-danger[_ngcontent-%COMP%]{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb;padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}",
      ],
    }));
  let t = e;
  return t;
})();
var vo = (() => {
  let e = class e {
    constructor(n, i) {
      (this.accountService = n), (this.router = i);
    }
    canActivate(n, i) {
      return this.accountService.isLoggedIn()
        ? !0
        : (this.router.navigate(["login"], {
            queryParams: { returnUrl: i.url },
          }),
          !1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(Mt), w(De));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var On = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.token = localStorage.getItem("token")),
        (this.path = "https://ulassahillioglu.pythonanywhere.com/products");
    }
    getProductById(n) {
      let i = this.path;
      return (
        n && (i += "/" + n + "/"),
        console.log(i),
        this.http.get(i).pipe(
          N((o) => console.log(JSON.stringify(o))),
          ge(this.handleError)
        )
      );
    }
    getUserId() {
      let n = "https://ulassahillioglu.pythonanywhere.com/test_token/",
        i = "Token " + this.token,
        o = new qt().set("Authorization", i);
      return this.http.get(n, { headers: o }).pipe(
        F((s) => (console.log("User ID is: ", JSON.stringify(s)), s)),
        ge(this.handleError)
      );
    }
    handleError(n) {
      let i = "";
      return (
        n.error instanceof ErrorEvent
          ? (i = `An error occurred: ${n.error.message}`)
          : (i = `Server returned code: ${n.status}, error message is: ${n.message}`),
        Ke(() => new Error(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(pt));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var Tr = (() => {
  let e = class e {
    constructor(n, i, o, s) {
      (this.alertifyService = n),
        (this.document = i),
        (this.http = o),
        (this.detailsService = s),
        (this.path =
          "https://ulassahillioglu.pythonanywhere.com/fav-products/"),
        (this.products = []);
    }
    addFavoriteProductToBackend(n) {
      return this.http.post(`${this.path}`, n).pipe(
        N((i) => console.log("Sent request to backend")),
        ge((i) => {
          throw (
            (console.error(
              "Error occurred while sending request to backend:",
              i
            ),
            i)
          );
        })
      );
    }
    addToFavs(n) {
      if (
        this.products.some((i) => i.id === n.id) &&
        this.products.find((o) => o.id === n.id)
      ) {
        console.log(n.name + " already in your favorites.");
        return;
      }
      this.addFavoriteProductToBackend(n).subscribe(
        (i) => {
          console.log("Product added to backend:", i),
            this.alertifyService.success("Product saved to favorites!");
        },
        (i) => {
          console.error("Error adding product to backend:", i);
        }
      );
    }
    deleteFromFavs(n) {
      return this.deleteFavoriteFromBackend(n).pipe(
        N((i) => {
          console.log("Product removed from backend:", i),
            this.alertifyService.message("Product removed from backend!");
        }),
        ge((i) => {
          throw (console.error("Error removing product from backend:", i), i);
        })
      );
    }
    deleteFavoriteFromBackend(n) {
      let i = n.id,
        o = this.path;
      return (
        n && (o += "?id=" + n.id),
        this.http.delete(`${o}`).pipe(
          N((s) => console.log("Sent request to backend")),
          ge((s) => {
            throw (
              (console.error(
                "Error occured while sending request to backend:",
                s
              ),
              s)
            );
          })
        )
      );
    }
    getFavs(n) {
      let i = this.path;
      return (
        n && (i += "?userId=" + n),
        console.log(i),
        this.http.get(i).pipe(
          N((o) => console.log(JSON.stringify(o))),
          ge(this.handleError)
        )
      );
    }
    removeFromFavs(n) {
      return (
        (this.products = this.products.filter((i) => i.id !== n.id)),
        this.alertifyService.error(n.name + " removed from favorites"),
        P(null).pipe(F(() => {}))
      );
    }
    removeAllFromFavs() {
      this.products = [];
    }
    handleError(n) {
      let i = "";
      return (
        n.error instanceof ErrorEvent
          ? (i = `An error occurred: ${n.error.message}`)
          : (i = `Server returned code: ${n.status}, error message is: ${n.message}`),
        Ke(() => new Error(i))
      );
    }
    ngOnInit() {
      throw new Error("Method not implemented.");
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(Be), w(Ce), w(pt), w(On));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function aF(t, e) {
  t & 1 &&
    (f(0, "div")(1, "div", 26)(2, "span", 27), m(3, "Loading..."), h()()());
}
var pC = (() => {
  let e = class e {
    constructor(n, i, o, s) {
      (this.detailsService = n),
        (this.activatedRoute = i),
        (this.alertifyService = o),
        (this.favoritesService = s),
        (this.title = "Product Details"),
        (this.favProduct = {
          id: 0,
          name: "",
          price: 0,
          description: "",
          imageUrl: "",
          date_added: new Date().toISOString().split("T")[0],
          userId: 0,
        }),
        (this.loading = !0),
        (this.cartService = C(Mr));
    }
    ngOnInit() {
      this.activatedRoute.params.subscribe((n) => {
        (this.productId = +n.id),
          this.productId &&
            (console.log("Product ID:", this.productId, typeof this.productId),
            this.loadProductDetails());
      });
    }
    createFavProduct(n) {
      return (
        (this.favProduct.id = n.id),
        (this.favProduct.name = n.name),
        (this.favProduct.price = n.price),
        (this.favProduct.description = n.description),
        (this.favProduct.imageUrl = n.imageUrl),
        this.detailsService.getUserId().subscribe(
          (i) => {
            this.favProduct.userId = i;
          },
          (i) => {
            console.error("Error fetching user ID:", i);
          }
        ),
        this.favProduct
      );
    }
    loadProductDetails() {
      this.detailsService.getProductById(this.productId).subscribe((n) => {
        (this.selectedProduct = n),
          this.createFavProduct(this.selectedProduct),
          console.log("Fav Product:", this.favProduct),
          console.log("Product:", this.selectedProduct),
          (this.loading = !1);
      });
    }
    addToCart(n) {
      this.cartService.addToCart(n);
    }
    addToFavs(n) {
      this.favoritesService.addToFavs(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(On), y(We), y(Be), y(Tr));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-details"]],
      features: [Me([Be, On])],
      decls: 44,
      vars: 12,
      consts: [
        [4, "ngIf"],
        [1, "py-5"],
        [1, "container"],
        [1, "row", "gx-5"],
        [1, "col-lg-6"],
        [1, "border", "rounded-4", "mb-3", "d-flex", "justify-content-center"],
        [
          "data-fslightbox",
          "mygalley",
          "target",
          "_blank",
          "data-type",
          "image",
          1,
          "rounded-4",
        ],
        [
          1,
          "rounded-4",
          "fit",
          2,
          "max-width",
          "100%",
          "max-height",
          "414px",
          "margin",
          "auto",
          3,
          "src",
        ],
        [1, "ps-lg-3"],
        [1, "title", "text-dark"],
        [1, "d-flex", "flex-row", "my-3"],
        [1, "text-warning", "mb-1", "me-2"],
        [1, "fa", "fa-star"],
        [1, "fas", "fa-star-half-alt"],
        [1, "ms-1"],
        [1, "text-muted"],
        [1, "fas", "fa-shopping-basket", "fa-sm", "mx-1"],
        [1, "text-success", "ms-2"],
        [1, "mb-3"],
        [1, "h5"],
        [1, "row", "col", "mb-4"],
        [
          "routerLink",
          "/cart",
          1,
          "btn",
          "btn-success",
          "shadow-0",
          "mr-3",
          "detail",
          3,
          "click",
        ],
        [
          1,
          "btn",
          "btn-primary",
          "shadow-0",
          "mr-3",
          "text-white",
          "detail",
          3,
          "click",
        ],
        [1, "me-1", "fa", "fa-shopping-basket"],
        [
          1,
          "btn",
          "btn-info",
          "border",
          "border-secondary",
          "py-2",
          "icon-hover",
          "px-3",
          "detail",
          3,
          "click",
        ],
        [1, "me-1", "fa", "fa-heart", "fa-lg"],
        ["role", "status", 1, "spinner-border"],
        [1, "visually-hidden"],
      ],
      template: function (i, o) {
        i & 1 &&
          (E(0, "app-category"),
          k(1, aF, 4, 0, "div", 0),
          f(2, "section", 1)(3, "div", 2)(4, "div", 3)(5, "div", 4)(
            6,
            "div",
            5
          )(7, "a", 6),
          E(8, "img", 7),
          h()()(),
          f(9, "div", 4)(10, "div", 8)(11, "h4", 9),
          m(12),
          h(),
          f(13, "div", 10)(14, "div", 11),
          E(15, "i", 12)(16, "i", 12)(17, "i", 12)(18, "i", 12)(19, "i", 13),
          f(20, "span", 14),
          m(21, " 4.5 "),
          h()(),
          f(22, "span", 15),
          E(23, "i", 16),
          m(24),
          h(),
          f(25, "span", 17),
          m(26),
          h()(),
          f(27, "div", 18)(28, "span", 19),
          m(29),
          Et(30, "currency"),
          h(),
          E(31, "span", 15),
          h(),
          f(32, "p"),
          m(33),
          h(),
          E(34, "hr")(35, "div", 20),
          f(36, "a", 21),
          U("click", function () {
            return o.addToCart(o.selectedProduct);
          }),
          m(37, " Buy now "),
          h(),
          f(38, "a", 22),
          U("click", function () {
            return o.addToCart(o.selectedProduct);
          }),
          E(39, "i", 23),
          m(40, " Add to cart "),
          h(),
          f(41, "a", 24),
          U("click", function () {
            return o.addToFavs(o.favProduct);
          }),
          E(42, "i", 25),
          m(43, " Save "),
          h()()()()()()),
          i & 2 &&
            (D(),
            M("ngIf", o.loading),
            D(7),
            M("src", o.selectedProduct.imageUrl, wt),
            D(4),
            me(" ", o.selectedProduct.name, " "),
            D(12),
            me("", o.selectedProduct.orderCount, " orders"),
            D(2),
            me("", o.selectedProduct.inStock, " In stock"),
            D(3),
            Le(Ht(30, 7, o.selectedProduct.price, "USD", "symbol", "1.2-2")),
            D(4),
            me(" ", o.selectedProduct.description, " "));
      },
      dependencies: [Te, et, lu, Mn],
      styles: [".detail[_ngcontent-%COMP%]{margin:10px}"],
    }));
  let t = e;
  return t;
})();
function lF(t, e) {
  if (t & 1) {
    let r = Je();
    f(0, "div", 36)(1, "div", 37),
      E(2, "img", 38),
      h(),
      f(3, "div", 39)(4, "h6", 40),
      m(5),
      h(),
      f(6, "h6", 41),
      m(7),
      h()(),
      f(8, "div", 42)(9, "button", 43),
      U("click", function () {
        let o = xe(r).$implicit,
          s = fe();
        return Ae(s.decrementQuantity(o));
      }),
      E(10, "i", 44),
      h(),
      f(11, "input", 45),
      qe("ngModelChange", function (i) {
        let s = xe(r).$implicit;
        return Xe(s.quantity, i) || (s.quantity = i), Ae(i);
      }),
      h(),
      f(12, "button", 43),
      U("click", function () {
        let o = xe(r).$implicit,
          s = fe();
        return Ae(s.incrementQuantity(o));
      }),
      E(13, "i", 46),
      h()(),
      f(14, "div", 47)(15, "h6", 17),
      m(16),
      Et(17, "currency"),
      h()(),
      f(18, "div", 48)(19, "button", 49),
      U("click", function () {
        let o = xe(r).$implicit,
          s = fe();
        return Ae(s.removeItem(o));
      }),
      E(20, "i", 50),
      h()()();
  }
  if (t & 2) {
    let r = e.$implicit,
      n = fe();
    D(2),
      M("src", r.imageUrl, wt)("alt", r.name),
      D(3),
      Le(r.name),
      D(2),
      Le(r.description),
      D(4),
      ze("ngModel", r.quantity),
      M("id", r.id)("value", r.quantity),
      D(5),
      Le(Ht(17, 8, n.getPrice(r), "USD", "symbol", "1.2-2"));
  }
}
function cF(t, e) {
  t & 1 && (f(0, "button", 51), m(1, "Register or Login"), h());
}
function uF(t, e) {
  t & 1 && (f(0, "button", 52), m(1, "Buy Now"), h());
}
var gC = (() => {
  let e = class e {
    constructor(n, i, o, s) {
      (this.cartService = n),
        (this.activatedRoute = i),
        (this.accountService = o),
        (this.router = s),
        (this.deliveryCost = 0),
        (this.products = this.cartService.getCart());
    }
    ngOnInit() {}
    decrementQuantity(n) {
      this.cartService.decrementQuantity(n);
    }
    incrementQuantity(n) {
      this.cartService.incrementQuantity(n);
    }
    onDeliveryOptionChange(n) {
      (this.deliveryCost = parseFloat(n.target.value)),
        this.calculateTotalPrice();
    }
    getPrice(n) {
      return this.cartService._currentPrice(n);
    }
    removeItem(n) {
      this.cartService.removeFromCart(n),
        (this.products = this.cartService.getCart());
    }
    removeAll() {
      window.confirm(
        "Are you sure you want to remove all items from the cart?"
      ) &&
        (this.cartService.removeAllFromCart(),
        (this.products = this.cartService.getCart()));
    }
    calculateTotalPrice() {
      let n = 0;
      return (
        this.products.forEach((i) => {
          n += i.price * i.quantity;
        }),
        n + this.deliveryCost
      );
    }
    isLoggedIn() {
      return this.accountService.isLoggedIn();
    }
    logOut() {
      this.accountService.logOut(), this.router.navigate(["login"]);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Mr), y(We), y(Mt), y(De));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-cart"]],
      decls: 60,
      vars: 16,
      consts: [
        [1, "h-100", "h-custom", 2, "background-color", "#d2c9ff"],
        [1, "container", "py-5", "h-100"],
        [
          1,
          "row",
          "d-flex",
          "justify-content-center",
          "align-products-center",
          "h-100",
        ],
        [1, "col-12"],
        [
          1,
          "card",
          "card-registration",
          "card-registration-2",
          2,
          "border-radius",
          "15px",
        ],
        [1, "card-body", "p-0"],
        [1, "row", "g-0"],
        [1, "col-lg-8"],
        [1, "p-5"],
        [
          1,
          "d-flex",
          "justify-content-between",
          "align-products-center",
          "mb-5",
        ],
        [1, "fw-bold", "mb-0", "text-black"],
        [1, "mb-0", "text-muted"],
        [1, "my-4"],
        [
          "class",
          "row mb-4 d-flex justify-content-between align-products-center",
          4,
          "ngFor",
          "ngForOf",
        ],
        [1, "d-flex", "justify-content-end", "mb-5"],
        [1, "btn", "btn-warning", 3, "click"],
        [1, "pt-5"],
        [1, "mb-0"],
        ["href", "#!", 1, "text-body"],
        [1, "fas", "fa-long-arrow-alt-left", "me-2"],
        [1, "col-lg-4", "bg-grey"],
        [1, "fw-bold", "mb-5", "mt-2", "pt-1"],
        [1, "d-flex", "justify-content-between", "mb-4"],
        [1, "text-uppercase"],
        [1, "text-uppercase", "mb-3"],
        [1, "mb-4", "pb-2"],
        [1, "select", "form-select", 3, "change"],
        ["value", "0"],
        ["value", "5"],
        [1, "mb-5"],
        [1, "form-outline"],
        [
          "type",
          "text",
          "id",
          "form3Examplea2",
          1,
          "form-control",
          "form-control-lg",
        ],
        ["for", "form3Examplea2", 1, "form-label"],
        [1, "d-flex", "justify-content-between", "mb-5"],
        [
          "routerLink",
          "/login",
          "type",
          "button",
          "class",
          "btn btn-dark btn-block btn-lg",
          "data-mdb-ripple-color",
          "dark",
          4,
          "ngIf",
        ],
        [
          "type",
          "button",
          "class",
          "btn btn-dark btn-block btn-lg",
          "data-mdb-ripple-color",
          "dark",
          4,
          "ngIf",
        ],
        [
          1,
          "row",
          "mb-4",
          "d-flex",
          "justify-content-between",
          "align-products-center",
        ],
        [1, "col-md-2", "col-lg-2", "col-xl-2"],
        [1, "img-fluid", "rounded-3", 3, "src", "alt"],
        [1, "col-md-3", "col-lg-3", "col-xl-3"],
        [1, "text-muted"],
        [1, "text-black", "mb-0"],
        [1, "col-md-3", "col-lg-3", "col-xl-2", "d-flex"],
        [1, "btn", "btn-link", "px-2", 3, "click"],
        [1, "fas", "fa-minus"],
        [
          "min",
          "0",
          "name",
          "quantity",
          1,
          "form-control",
          "form-control-sm",
          2,
          "height",
          "auto",
          "width",
          "50px",
          "text-align",
          "center",
          3,
          "ngModel",
          "id",
          "value",
          "ngModelChange",
        ],
        [1, "fas", "fa-plus"],
        [1, "col-md-3", "col-lg-2", "col-xl-2", "offset-lg-1"],
        [1, "col-md-1", "col-lg-1", "col-xl-1", "text-end"],
        [1, "text-muted", "border-0", 3, "click"],
        [1, "fas", "fa-times"],
        [
          "routerLink",
          "/login",
          "type",
          "button",
          "data-mdb-ripple-color",
          "dark",
          1,
          "btn",
          "btn-dark",
          "btn-block",
          "btn-lg",
        ],
        [
          "type",
          "button",
          "data-mdb-ripple-color",
          "dark",
          1,
          "btn",
          "btn-dark",
          "btn-block",
          "btn-lg",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
            4,
            "div",
            4
          )(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9)(
            10,
            "h1",
            10
          ),
          m(11, "Your Cart"),
          h(),
          f(12, "h6", 11),
          m(13),
          h()(),
          E(14, "hr", 12),
          k(15, lF, 21, 13, "div", 13),
          E(16, "hr", 12),
          f(17, "div", 14)(18, "a", 15),
          U("click", function () {
            return o.removeAll();
          }),
          m(19, " Empty Cart "),
          h()(),
          f(20, "div", 16)(21, "h6", 17)(22, "a", 18),
          E(23, "i", 19),
          m(24, "Back to shop"),
          h()()()()(),
          f(25, "div", 20)(26, "div", 8)(27, "h3", 21),
          m(28, "Summary"),
          h(),
          E(29, "hr", 12),
          f(30, "div", 22)(31, "h5", 23),
          m(32, "Sub-Total"),
          h(),
          f(33, "h5"),
          m(34),
          Et(35, "currency"),
          h()(),
          f(36, "h5", 24),
          m(37, "Shipping"),
          h(),
          f(38, "div", 25)(39, "select", 26),
          U("change", function (a) {
            return o.onDeliveryOptionChange(a);
          }),
          f(40, "option", 27),
          m(41, "Standard-Delivery - Free"),
          h(),
          f(42, "option", 28),
          m(43, "Fast Delivery - $5"),
          h()()(),
          f(44, "h5", 24),
          m(45, "Give code"),
          h(),
          f(46, "div", 29)(47, "div", 30),
          E(48, "input", 31),
          f(49, "label", 32),
          m(50, "Enter your code"),
          h()()(),
          E(51, "hr", 12),
          f(52, "div", 33)(53, "h5", 23),
          m(54, "Total price"),
          h(),
          f(55, "h5"),
          m(56),
          Et(57, "currency"),
          h()(),
          k(58, cF, 2, 0, "button", 34)(59, uF, 2, 0, "button", 35),
          h()()()()()()()()()),
          i & 2 &&
            (D(13),
            me("", o.products.length, " products"),
            D(2),
            M("ngForOf", o.products),
            D(19),
            Le(Ht(35, 6, o.calculateTotalPrice(), "USD", "symbol", "1.2-2")),
            D(22),
            me(
              "",
              Ht(57, 11, o.calculateTotalPrice(), "USD", "symbol", "1.2-2"),
              " "
            ),
            D(2),
            M("ngIf", o.isLoggedIn() === !1),
            D(),
            M("ngIf", o.isLoggedIn() === !0));
      },
      dependencies: [Ge, Te, et, Zi, Ji, It, Gt, un, Mn],
      styles: [
        "@media (min-width: 1025px){.h-custom[_ngcontent-%COMP%]{height:100vh!important}}.card-registration[_ngcontent-%COMP%]   .select-input.form-control[readonly][_ngcontent-%COMP%]:not([disabled]){font-size:1rem;line-height:2.15;padding-left:.75em;padding-right:.75em}.card-registration[_ngcontent-%COMP%]   .select-arrow[_ngcontent-%COMP%]{top:13px}.bg-grey[_ngcontent-%COMP%]{background-color:#eae8e8}@media (min-width: 992px){.card-registration-2[_ngcontent-%COMP%]   .bg-grey[_ngcontent-%COMP%]{border-top-right-radius:16px;border-bottom-right-radius:16px}}@media (max-width: 991px){.card-registration-2[_ngcontent-%COMP%]   .bg-grey[_ngcontent-%COMP%]{border-bottom-left-radius:16px;border-bottom-right-radius:16px}}img[_ngcontent-%COMP%]{max-width:100%;height:103.94px}",
      ],
    }));
  let t = e;
  return t;
})();
function dF(t, e) {
  t & 1 &&
    (f(0, "div")(1, "div", 3)(2, "span", 4), m(3, "Loading..."), h()()());
}
function fF(t, e) {
  if (t & 1) {
    let r = Je();
    f(0, "div", 5)(1, "div", 6),
      E(2, "img", 7),
      f(3, "div", 8)(4, "h5", 9),
      m(5),
      h(),
      f(6, "p", 10),
      m(7),
      h(),
      f(8, "p", 11)(9, "small", 12),
      m(10),
      h()()(),
      f(11, "div", 13)(12, "button", 14),
      U("click", function () {
        let o = xe(r).$implicit,
          s = fe();
        return Ae(s.removeItem(o));
      }),
      m(13, "Remove"),
      h()()()();
  }
  if (t & 2) {
    let r = e.$implicit;
    D(2),
      M("src", r.imageUrl, wt),
      D(3),
      me("", r.name, " "),
      D(2),
      me("", r.description, " "),
      D(3),
      me("Added on ", r.date_added, "");
  }
}
var mC = (() => {
  let e = class e {
    constructor(n, i, o, s) {
      (this.favoritesService = n),
        (this.router = i),
        (this.accountService = o),
        (this.detailsService = s),
        (this.userId = localStorage.getItem("user_id")),
        (this.products = []),
        (this.dateAdded = new Date()),
        (this.loading = !0);
    }
    removeItem(n) {
      this.favoritesService.deleteFromFavs(n).subscribe(
        () => {
          this.products = this.products.filter((i) => i.id !== n.id);
        },
        (i) => {
          console.error("Error removing item from favorites:", i);
        }
      );
    }
    removeAll() {
      window.confirm(
        "Are you sure you want to remove all items from the list?"
      ) && this.favoritesService.removeAllFromFavs();
    }
    isLoggedIn() {
      return this.accountService.isLoggedIn();
    }
    fetchFavorites() {
      this.favoritesService.getFavs(this.userId).subscribe((n) => {
        (this.products = n), (this.loading = !1);
      });
    }
    ngOnInit() {
      this.fetchFavorites();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(Tr), y(De), y(Mt), y(On));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-favorites"]],
      decls: 3,
      vars: 2,
      consts: [
        [4, "ngIf"],
        [1, "row"],
        ["class", "card-group", 4, "ngFor", "ngForOf"],
        ["role", "status", 1, "spinner-border"],
        [1, "visually-hidden"],
        [1, "card-group"],
        [1, "card"],
        ["alt", "...", 1, "card-img-top", 3, "src"],
        [1, "card-body"],
        [1, "card-title"],
        [1, "card-text"],
        [1, "card-text", "text-white"],
        [1, "text-body-secondary"],
        [1, "card-footer"],
        [1, "btn", "btn-danger", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 &&
          (k(0, dF, 4, 0, "div", 0),
          f(1, "div", 1),
          k(2, fF, 14, 4, "div", 2),
          h()),
          i & 2 && (M("ngIf", o.loading), D(2), M("ngForOf", o.products));
      },
      dependencies: [Ge, Te],
      styles: [
        ".card-img-top[_ngcontent-%COMP%]{max-width:100px;max-height:100px}.spinner-border[_ngcontent-%COMP%]{color:#ff6b6b}.card[_ngcontent-%COMP%]{background:linear-gradient(to right,#ff6b6b,#6b47ff);border:none;border-radius:10px;margin-bottom:20px;box-shadow:0 0 20px #0003;transition:transform .3s ease-in-out,box-shadow .3s ease-in-out}.card[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 0 30px #0006}.card-img-top[_ngcontent-%COMP%]{border-top-left-radius:10px;border-top-right-radius:10px}.card-body[_ngcontent-%COMP%]{padding:20px}.card-title[_ngcontent-%COMP%]{color:#fff;font-size:1.5rem;font-weight:700;margin-bottom:10px}.card-text[_ngcontent-%COMP%]{color:#fff;font-size:1.2rem;margin-bottom:10px}.text-body-secondary[_ngcontent-%COMP%]{color:#fff;font-size:1rem}body[_ngcontent-%COMP%]{background-color:#f4f4f4;color:#333}.row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:center}.product-image[_ngcontent-%COMP%]{margin-top:1vh;margin-left:1vh;width:100px;height:100px;object-fit:cover}.stylish-card[_ngcontent-%COMP%]{background-color:#f9f9f9;border-radius:10px;padding:20px;box-shadow:0 2px 5px #0000001a;transition:all .3s ease}.stylish-card[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 5px 15px #0003}.product-description[_ngcontent-%COMP%]{font-size:18px;color:#333;margin-bottom:10px}.product-price[_ngcontent-%COMP%]{font-size:20px;color:#0617ff;font-weight:700;margin-bottom:10px}.purchase-date[_ngcontent-%COMP%]{font-style:italic;color:#74df37}",
      ],
    }));
  let t = e;
  return t;
})();
function hF(t, e) {
  t & 1 && (f(0, "div", 33), m(1, "Passwords do not match"), h());
}
function pF(t, e) {
  if ((t & 1 && (f(0, "div", 34), m(1), h()), t & 2)) {
    let r = fe();
    D(), Le(r.errorMessage);
  }
}
var yg = class {},
  vC = (() => {
    let e = class e {
      constructor(n, i, o, s) {
        (this.accountService = n),
          (this.router = i),
          (this.route = o),
          (this.alertifyService = s),
          (this.model = new yg()),
          (this.errorMessage = "");
      }
      signup(n) {
        n.valid
          ? (console.log(
              "Attempting signup with username:",
              this.model.username
            ),
            this.accountService
              .signup(this.model)
              .pipe(Ve())
              .subscribe({
                next: (i) => {
                  console.log("Login successful:", i),
                    this.alertifyService.success("Signup successful!");
                  let o = this.route.snapshot.queryParams.returnUrl || "/";
                  this.router.navigateByUrl(o);
                },
                error: (i) => {
                  console.error("Error during signup:", i),
                    (this.errorMessage = "Invalid username or password.");
                },
              }))
          : (this.errorMessage = "Please fill in all fields");
      }
      ngOnInit() {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Mt), y(De), y(We), y(Be));
    }),
      (e.ɵcmp = re({
        type: e,
        selectors: [["app-signup"]],
        decls: 51,
        vars: 6,
        consts: [
          [1, "limiter"],
          [3, "ngSubmit"],
          ["signupForm", "ngForm"],
          [
            1,
            "vh-100",
            "bg-image",
            2,
            "background-image",
            "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
          ],
          [
            1,
            "mask",
            "d-flex",
            "align-items-center",
            "h-100",
            "gradient-custom-3",
          ],
          [1, "container", "h-100"],
          [
            1,
            "row",
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "h-100",
          ],
          [1, "col-12", "col-md-9", "col-lg-7", "col-xl-6"],
          [1, "card", 2, "border-radius", "15px"],
          [1, "card-body", "p-5"],
          [1, "text-uppercase", "text-center", "mb-5"],
          ["data-mdb-input-init", "", 1, "form-outline", "mb-4"],
          [
            "type",
            "text",
            "id",
            "username",
            "name",
            "username",
            "required",
            "",
            1,
            "form-control",
            "form-control-lg",
            3,
            "ngModel",
            "ngModelChange",
          ],
          ["username", "ngModel"],
          [1, "form-label"],
          [
            "type",
            "email",
            "type",
            "email",
            "id",
            "email",
            "name",
            "email",
            "required",
            "",
            1,
            "form-control",
            "form-control-lg",
            3,
            "ngModel",
            "ngModelChange",
          ],
          ["email", "ngModel"],
          [
            "type",
            "password",
            "type",
            "password",
            "id",
            "pass",
            "name",
            "pass",
            "required",
            "",
            1,
            "form-control",
            "form-control-lg",
            3,
            "ngModel",
            "ngModelChange",
          ],
          ["password", "ngModel"],
          [
            "type",
            "password",
            "name",
            "confirmPassword",
            "id",
            "confirmPass",
            1,
            "form-control",
            "form-control-lg",
            3,
            "ngModel",
            "ngModelChange",
          ],
          ["confirmPassword", "ngModel"],
          ["class", "text-danger", 4, "ngIf"],
          [1, "form-check", "mb-4"],
          [1, "row"],
          [1, "col-auto"],
          [
            "type",
            "checkbox",
            "value",
            "",
            "id",
            "form2Example3cg",
            1,
            "form-check-input",
          ],
          ["for", "form2Example3cg", 1, "form-check-label"],
          ["href", "#!", 1, "text-body"],
          ["class", "alert alert-danger", 4, "ngIf"],
          [1, "d-flex", "justify-content-center"],
          [
            1,
            "btn",
            "btn-success",
            "btn-block",
            "btn-lg",
            "gradient-custom-4",
            "text-body",
          ],
          [1, "text-center", "text-muted", "mt-5", "mb-0"],
          ["routerLink", "/login", 1, "fw-bold", "text-body"],
          [1, "text-danger"],
          [1, "alert", "alert-danger"],
        ],
        template: function (i, o) {
          if (i & 1) {
            let s = Je();
            f(0, "div", 0)(1, "form", 1, 2),
              U("ngSubmit", function () {
                xe(s);
                let l = _t(2);
                return Ae(o.signup(l));
              }),
              f(3, "section", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(
                7,
                "div",
                7
              )(8, "div", 8)(9, "div", 9)(10, "h2", 10),
              m(11, "Create an account"),
              h(),
              f(12, "div", 11)(13, "input", 12, 13),
              qe("ngModelChange", function (l) {
                return Xe(o.model.username, l) || (o.model.username = l), l;
              }),
              h(),
              f(15, "label", 14),
              m(16, "Your Username"),
              h()(),
              f(17, "div", 11)(18, "input", 15, 16),
              qe("ngModelChange", function (l) {
                return Xe(o.model.email, l) || (o.model.email = l), l;
              }),
              h(),
              f(20, "label", 14),
              m(21, "Your Email"),
              h()(),
              f(22, "div", 11)(23, "input", 17, 18),
              qe("ngModelChange", function (l) {
                return Xe(o.model.password, l) || (o.model.password = l), l;
              }),
              h(),
              f(25, "label", 14),
              m(26, "Password"),
              h()(),
              f(27, "div", 11)(28, "input", 19, 20),
              qe("ngModelChange", function (l) {
                return (
                  Xe(o.model.confirmPassword, l) ||
                    (o.model.confirmPassword = l),
                  l
                );
              }),
              h(),
              f(30, "label", 14),
              m(31, "Repeat your password"),
              h(),
              k(32, hF, 2, 0, "div", 21),
              h(),
              f(33, "div", 22)(34, "div", 23)(35, "div", 24),
              E(36, "input", 25),
              f(37, "label", 26),
              m(38, " I agree all statements in "),
              f(39, "a", 27)(40, "u"),
              m(41, "Terms of service"),
              h()()()()()(),
              k(42, pF, 2, 1, "div", 28),
              f(43, "div", 29)(44, "button", 30),
              m(45, "Register"),
              h()(),
              f(46, "p", 31),
              m(47, "Have already an account? "),
              f(48, "a", 32)(49, "u"),
              m(50, "Login here"),
              h()()()()()()()()()()()();
          }
          if (i & 2) {
            let s = _t(24),
              a = _t(29);
            D(13),
              ze("ngModel", o.model.username),
              D(5),
              ze("ngModel", o.model.email),
              D(5),
              ze("ngModel", o.model.password),
              D(5),
              ze("ngModel", o.model.confirmPassword),
              D(4),
              M("ngIf", s.value !== a.value && a.touched),
              D(10),
              M("ngIf", o.errorMessage);
          }
        },
        dependencies: [Te, et, Dr, It, Gt, yr, Zn, un, ri],
        styles: [
          ".gradient-custom-3[_ngcontent-%COMP%]{background:#84fab0;background:-webkit-linear-gradient(to right,rgba(132,250,176,.5),rgba(143,211,244,.5));background:linear-gradient(to right,#84fab080,#8fd3f480)}.gradient-custom-4[_ngcontent-%COMP%]{background:#84fab0;background:-webkit-linear-gradient(to right,rgba(132,250,176,1),rgba(143,211,244,1));background:linear-gradient(to right,#84fab0,#8fd3f4)}",
        ],
      }));
    let t = e;
    return t;
  })();
var yC = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.path = "https://ulassahillioglu.pythonanywhere.com/orders/");
    }
    getOrdersFromBackend(n) {
      let i = this.path;
      return (
        n && (i += "?userId=" + n),
        console.log(i),
        this.http.get(i).pipe(
          N((o) => console.log(JSON.stringify(o))),
          ge(this.handleError)
        )
      );
    }
    handleError(n) {
      let i = "";
      return (
        n.error instanceof ErrorEvent
          ? (i = `An error occurred: ${n.error.message}`)
          : (i = `Server returned code: ${n.status}, error message is: ${n.message}`),
        Ke(() => new Error(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(w(pt));
  }),
    (e.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function mF(t, e) {
  t & 1 &&
    (f(0, "div")(1, "div", 3)(2, "span", 4), m(3, "Loading..."), h()()());
}
function vF(t, e) {
  if (
    (t & 1 &&
      (f(0, "li", 5)(1, "div", 6)(2, "div", 7)(3, "div", 8),
      E(4, "img", 9),
      h(),
      f(5, "div", 10)(6, "div", 11)(7, "h5", 12),
      m(8),
      h(),
      f(9, "button", 13),
      m(10, "Show Details"),
      h(),
      f(11, "div", 14)(12, "div", 15)(13, "p", 16),
      m(14),
      h(),
      f(15, "p", 17),
      m(16),
      Et(17, "currency"),
      h(),
      f(18, "p", 18),
      m(19),
      Et(20, "date"),
      h()()()()()()()()),
    t & 2)
  ) {
    let r = e.$implicit;
    D(4),
      M("src", r.imageUrl, wt),
      D(4),
      Le(r.name),
      D(),
      hr("data-bs-target", "#details-" + r.id),
      D(2),
      M("id", "details-" + r.id),
      D(3),
      Le(r.description),
      D(2),
      Le(Ht(17, 7, r.price, "USD", "symbol", "1.2-2")),
      D(3),
      me("Purchased on ", Ll(20, 12, r.date_added, "dd/MM/yyyy"), "");
  }
}
var DC = (() => {
  let e = class e {
    constructor(n) {
      (this.ordersService = n),
        (this.products = []),
        (this.userId = localStorage.getItem("user_id")),
        (this.loading = !0);
    }
    getOrders() {
      this.ordersService.getOrdersFromBackend(this.userId).subscribe((n) => {
        (this.products = n), (this.loading = !1);
      });
    }
    ngOnInit() {
      this.getOrders();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(yC));
  }),
    (e.ɵcmp = re({
      type: e,
      selectors: [["app-orders"]],
      decls: 3,
      vars: 2,
      consts: [
        [4, "ngIf"],
        [1, "list-group"],
        ["class", "list-group-item", 4, "ngFor", "ngForOf"],
        ["role", "status", 1, "spinner-border"],
        [1, "visually-hidden"],
        [1, "list-group-item"],
        [1, "card", "mb-3"],
        [1, "row", "g-0"],
        [1, "col-md-4"],
        [
          "alt",
          "...",
          1,
          "img-fluid",
          "rounded-start",
          "product-image",
          3,
          "src",
        ],
        [1, "col-md-8"],
        [1, "card-body"],
        [1, "card-title"],
        [
          "type",
          "button",
          "data-bs-toggle",
          "collapse",
          "aria-expanded",
          "false",
          "aria-controls",
          "details",
          1,
          "btn",
          "btn-primary",
        ],
        [1, "collapse", 3, "id"],
        [1, "card", "card-body", "stylish-card"],
        [1, "product-description"],
        [1, "product-price"],
        [1, "purchase-date"],
      ],
      template: function (i, o) {
        i & 1 &&
          (k(0, mF, 4, 0, "div", 0),
          f(1, "ul", 1),
          k(2, vF, 21, 15, "li", 2),
          h()),
          i & 2 && (M("ngIf", o.loading), D(2), M("ngForOf", o.products));
      },
      dependencies: [Ge, Te, Mn, yD],
      styles: [
        ".card-img-top[_ngcontent-%COMP%]{max-width:100px;max-height:100px}.spinner-border[_ngcontent-%COMP%]{color:#ff6b6b}.card[_ngcontent-%COMP%]{background:linear-gradient(to right,#ff6b6b,#6b47ff);border:none;border-radius:10px;margin-bottom:20px;box-shadow:0 0 20px #0003;transition:transform .3s ease-in-out,box-shadow .3s ease-in-out}.card[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 0 30px #0006}.card-img-top[_ngcontent-%COMP%]{border-top-left-radius:10px;border-top-right-radius:10px}.card-body[_ngcontent-%COMP%]{padding:20px}.card-title[_ngcontent-%COMP%]{color:#fff;font-size:1.5rem;font-weight:700;margin-bottom:10px}.card-text[_ngcontent-%COMP%]{color:#fff;font-size:1.2rem;margin-bottom:10px}.text-body-secondary[_ngcontent-%COMP%]{color:#fff;font-size:1rem}body[_ngcontent-%COMP%]{background-color:#f4f4f4;color:#333}.row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:center}.product-image[_ngcontent-%COMP%]{margin-top:1vh;margin-left:1vh;width:100px;height:100px;object-fit:cover}.stylish-card[_ngcontent-%COMP%]{background-color:#f9f9f9;border-radius:10px;padding:20px;box-shadow:0 2px 5px #0000001a;transition:all .3s ease;margin-top:10px}.stylish-card[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 5px 15px #0003}.product-description[_ngcontent-%COMP%]{font-size:18px;color:#333;margin-bottom:10px}.product-price[_ngcontent-%COMP%]{font-size:20px;color:#0617ff;font-weight:700;margin-bottom:10px}.purchase-date[_ngcontent-%COMP%]{font-style:italic;color:#74df37}",
      ],
    }));
  let t = e;
  return t;
})();
var yF = [
    { path: "products", component: mg },
    { path: "products/details/:id", component: pC },
    { path: "carousel", component: au },
    { path: "product-add-1", component: uC, canActivate: [vo] },
    { path: "product-add-2", component: dC, canActivate: [vo] },
    { path: "", redirectTo: "products", pathMatch: "full" },
    { path: "products/category/:categoryId", component: mg },
    { path: "login", component: fC },
    { path: "cart", component: gC },
    { path: "favorites", component: mC, canActivate: [vo] },
    { path: "signup", component: vC },
    { path: "orders", component: DC },
  ],
  wC = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Fe({ type: e })),
      (e.ɵinj = ke({ imports: [sg.forRoot(yF), sg] }));
    let t = e;
    return t;
  })();
var DF = (t) => ({ "show-scrollTop": t }),
  bC = (() => {
    let e = class e {
      constructor(n) {
        this.document = n;
      }
      onWindowScroll() {
        window.scrollY ||
        this.document.documentElement.scrollTop ||
        this.document.body.scrollTop > 100
          ? (this.windowScrolled = !0)
          : ((this.windowScrolled && window.scrollY) ||
              document.documentElement.scrollTop ||
              document.body.scrollTop < 10) &&
            (this.windowScrolled = !1);
      }
      scrollToTop() {
        window.scrollTo(0, 0);
      }
      ngOnInit() {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Ce));
    }),
      (e.ɵcmp = re({
        type: e,
        selectors: [["app-scroll-to-top"]],
        hostBindings: function (i, o) {
          i & 1 &&
            U(
              "scroll",
              function () {
                return o.onWindowScroll();
              },
              !1,
              Iy
            );
        },
        decls: 3,
        vars: 3,
        consts: [
          [1, "scroll-to-top", 3, "ngClass"],
          [
            "type",
            "button",
            "data-toggle",
            "button",
            "aria-pressed",
            "true",
            1,
            "btn",
            "active",
            3,
            "click",
          ],
          [1, "fas", "fa-chevron-up"],
        ],
        template: function (i, o) {
          i & 1 &&
            (f(0, "div", 0)(1, "button", 1),
            U("click", function () {
              return o.scrollToTop();
            }),
            E(2, "i", 2),
            h()()),
            i & 2 && M("ngClass", ln(1, DF, o.windowScrolled));
        },
        dependencies: [Jo],
        styles: [
          ".scroll-to-top[_ngcontent-%COMP%]{position:fixed;bottom:15px;right:15px;opacity:0;transition:all .2s ease-in-out}.show-scrollTop[_ngcontent-%COMP%]{opacity:1;transition:all .2s ease-in-out}",
        ],
      }));
    let t = e;
    return t;
  })();
function bF(t, e) {
  t & 1 && (f(0, "a", 80), E(1, "i", 81), m(2, " Login "), h());
}
function CF(t, e) {
  if (t & 1) {
    let r = Je();
    f(0, "a", 82),
      U("click", function () {
        xe(r);
        let i = fe();
        return Ae(i.logOut());
      }),
      E(1, "i", 81),
      m(2, " Logout "),
      h();
  }
}
function _F(t, e) {
  t & 1 &&
    (f(0, "a", 83),
    dt(),
    f(1, "svg", 56),
    E(2, "use", 84),
    h(),
    m(3, " Add Product / Classic "),
    h());
}
function EF(t, e) {
  t & 1 &&
    (f(0, "a", 85),
    dt(),
    f(1, "svg", 56),
    E(2, "use", 86),
    h(),
    m(3, " Add Product / Reactive "),
    h());
}
function SF(t, e) {
  t & 1 &&
    (f(0, "a", 87),
    dt(),
    f(1, "svg", 56),
    E(2, "use", 88),
    h(),
    m(3, " Your Orders "),
    h());
}
function IF(t, e) {
  t & 1 &&
    (f(0, "a", 67),
    dt(),
    f(1, "svg", 56),
    E(2, "use", 89),
    h(),
    m(3, " Integrations "),
    h());
}
function MF(t, e) {
  t & 1 &&
    (f(0, "div", 90)(1, "h6", 91)(2, "span"),
    m(3, "Saved reports"),
    h(),
    f(4, "a", 92),
    dt(),
    f(5, "svg", 56),
    E(6, "use", 93),
    h()()(),
    Cn(),
    f(7, "ul", 66)(8, "li", 42)(9, "a", 67),
    dt(),
    f(10, "svg", 56),
    E(11, "use", 94),
    h(),
    m(12, " Current month "),
    h()(),
    Cn(),
    f(13, "li", 42)(14, "a", 67),
    dt(),
    f(15, "svg", 56),
    E(16, "use", 94),
    h(),
    m(17, " Last quarter "),
    h()(),
    Cn(),
    f(18, "li", 42)(19, "a", 67),
    dt(),
    f(20, "svg", 56),
    E(21, "use", 94),
    h(),
    m(22, " Social engagement "),
    h()(),
    Cn(),
    f(23, "li", 42)(24, "a", 67),
    dt(),
    f(25, "svg", 56),
    E(26, "use", 94),
    h(),
    m(27, " Year-end sale "),
    h()()()());
}
var TF = () => ["/favorites"],
  CC = (() => {
    let e = class e {
      constructor(n, i) {
        (this.accountService = n),
          (this.router = i),
          (this.title = "shop"),
          (this.user = "notAdmin "),
          (this.cartService = C(Mr)),
          (this.favService = C(Tr));
      }
      ngOnInit() {
        this.accountService.checkSuperuser().subscribe(
          (n) => {
            this.isSuperuser = n.is_superuser;
          },
          (n) => {
            console.error("Error checking superuser status:", n);
          }
        );
      }
      isLoggedIn() {
        return this.accountService.isLoggedIn();
      }
      authStatus() {
        return this.accountService.checkAdmin();
      }
      logOut() {
        this.accountService.logOut(),
          this.router.navigate(["login"]),
          (this.isSuperuser = !1);
      }
      getCart() {
        let n = 0;
        return (
          this.cartService.getCart().forEach((o) => {
            n += o.quantity;
          }),
          n
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Mt), y(De));
    }),
      (e.ɵcmp = re({
        type: e,
        selectors: [["app-root"]],
        decls: 171,
        vars: 10,
        consts: [
          ["xmlns", "http://www.w3.org/2000/svg", 1, "d-none"],
          ["id", "calendar3", "viewBox", "0 0 16 16"],
          [
            "d",
            "M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z",
          ],
          [
            "d",
            "M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
          ],
          ["id", "heart"],
          [
            "d",
            "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15",
          ],
          ["id", "orders", "viewBox", "0 0 16 16"],
          [
            "fill-rule",
            "evenodd",
            "d",
            "M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0",
          ],
          [
            "d",
            "M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z",
          ],
          ["id", "cart", "viewBox", "0 0 16 16"],
          [
            "d",
            "M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
          ],
          ["id", "chevron-right", "viewBox", "0 0 16 16"],
          [
            "fill-rule",
            "evenodd",
            "d",
            "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z",
          ],
          ["id", "door-closed", "viewBox", "0 0 16 16"],
          [
            "d",
            "M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z",
          ],
          ["d", "M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"],
          ["id", "file-earmark", "viewBox", "0 0 16 16"],
          [
            "d",
            "M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z",
          ],
          ["id", "file-earmark-text", "viewBox", "0 0 16 16"],
          [
            "d",
            "M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z",
          ],
          [
            "d",
            "M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z",
          ],
          ["id", "gear-wide-connected", "viewBox", "0 0 16 16"],
          [
            "d",
            "M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z",
          ],
          ["id", "graph-up", "viewBox", "0 0 16 16"],
          [
            "fill-rule",
            "evenodd",
            "d",
            "M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z",
          ],
          ["id", "house-fill", "viewBox", "0 0 16 16"],
          [
            "d",
            "M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z",
          ],
          [
            "d",
            "m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z",
          ],
          ["id", "list", "viewBox", "0 0 16 16"],
          [
            "fill-rule",
            "evenodd",
            "d",
            "M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z",
          ],
          ["id", "people", "viewBox", "0 0 16 16"],
          [
            "d",
            "M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
          ],
          ["id", "plus-circle", "viewBox", "0 0 16 16"],
          [
            "d",
            "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
          ],
          [
            "d",
            "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z",
          ],
          ["id", "puzzle", "viewBox", "0 0 16 16"],
          [
            "d",
            "M3.112 3.645A1.5 1.5 0 0 1 4.605 2H7a.5.5 0 0 1 .5.5v.382c0 .696-.497 1.182-.872 1.469a.459.459 0 0 0-.115.118.113.113 0 0 0-.012.025L6.5 4.5v.003l.003.01c.004.01.014.028.036.053a.86.86 0 0 0 .27.194C7.09 4.9 7.51 5 8 5c.492 0 .912-.1 1.19-.24a.86.86 0 0 0 .271-.194.213.213 0 0 0 .039-.063v-.009a.112.112 0 0 0-.012-.025.459.459 0 0 0-.115-.118c-.375-.287-.872-.773-.872-1.469V2.5A.5.5 0 0 1 9 2h2.395a1.5 1.5 0 0 1 1.493 1.645L12.645 6.5h.237c.195 0 .42-.147.675-.48.21-.274.528-.52.943-.52.568 0 .947.447 1.154.862C15.877 6.807 16 7.387 16 8s-.123 1.193-.346 1.638c-.207.415-.586.862-1.154.862-.415 0-.733-.246-.943-.52-.255-.333-.48-.48-.675-.48h-.237l.243 2.855A1.5 1.5 0 0 1 11.395 14H9a.5.5 0 0 1-.5-.5v-.382c0-.696.497-1.182.872-1.469a.459.459 0 0 0 .115-.118.113.113 0 0 0 .012-.025L9.5 11.5v-.003a.214.214 0 0 0-.039-.064.859.859 0 0 0-.27-.193C8.91 11.1 8.49 11 8 11c-.491 0-.912.1-1.19.24a.859.859 0 0 0-.271.194.214.214 0 0 0-.039.063v.003l.001.006a.113.113 0 0 0 .012.025c.016.027.05.068.115.118.375.287.872.773.872 1.469v.382a.5.5 0 0 1-.5.5H4.605a1.5 1.5 0 0 1-1.493-1.645L3.356 9.5h-.238c-.195 0-.42.147-.675.48-.21.274-.528.52-.943.52-.568 0-.947-.447-1.154-.862C.123 9.193 0 8.613 0 8s.123-1.193.346-1.638C.553 5.947.932 5.5 1.5 5.5c.415 0 .733.246.943.52.255.333.48.48.675.48h.238l-.244-2.855zM4.605 3a.5.5 0 0 0-.498.55l.001.007.29 3.4A.5.5 0 0 1 3.9 7.5h-.782c-.696 0-1.182-.497-1.469-.872a.459.459 0 0 0-.118-.115.112.112 0 0 0-.025-.012L1.5 6.5h-.003a.213.213 0 0 0-.064.039.86.86 0 0 0-.193.27C1.1 7.09 1 7.51 1 8c0 .491.1.912.24 1.19.07.14.14.225.194.271a.213.213 0 0 0 .063.039H1.5l.006-.001a.112.112 0 0 0 .025-.012.459.459 0 0 0 .118-.115c.287-.375.773-.872 1.469-.872H3.9a.5.5 0 0 1 .498.542l-.29 3.408a.5.5 0 0 0 .497.55h1.878c-.048-.166-.195-.352-.463-.557-.274-.21-.52-.528-.52-.943 0-.568.447-.947.862-1.154C6.807 10.123 7.387 10 8 10s1.193.123 1.638.346c.415.207.862.586.862 1.154 0 .415-.246.733-.52.943-.268.205-.415.39-.463.557h1.878a.5.5 0 0 0 .498-.55l-.001-.007-.29-3.4A.5.5 0 0 1 12.1 8.5h.782c.696 0 1.182.497 1.469.872.05.065.091.099.118.115.013.008.021.01.025.012a.02.02 0 0 0 .006.001h.003a.214.214 0 0 0 .064-.039.86.86 0 0 0 .193-.27c.14-.28.24-.7.24-1.191 0-.492-.1-.912-.24-1.19a.86.86 0 0 0-.194-.271.215.215 0 0 0-.063-.039H14.5l-.006.001a.113.113 0 0 0-.025.012.459.459 0 0 0-.118.115c-.287.375-.773.872-1.469.872H12.1a.5.5 0 0 1-.498-.543l.29-3.407a.5.5 0 0 0-.497-.55H9.517c.048.166.195.352.463.557.274.21.52.528.52.943 0 .568-.447.947-.862 1.154C9.193 5.877 8.613 6 8 6s-1.193-.123-1.638-.346C5.947 5.447 5.5 5.068 5.5 4.5c0-.415.246-.733.52-.943.268-.205.415-.39.463-.557H4.605z",
          ],
          ["id", "search", "viewBox", "0 0 16 16"],
          [
            "d",
            "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z",
          ],
          [
            "data-bs-theme",
            "dark",
            1,
            "navbar",
            "sticky-top",
            "bg-dark",
            "flex-md-nowrap",
            "p-0",
            "shadow",
          ],
          [
            "href",
            "#",
            1,
            "navbar-brand",
            "col-md-3",
            "col-lg-2",
            "me-0",
            "px-3",
            "fs-6",
            "text-white",
          ],
          [1, "navbar", "px-3", "ulnav"],
          [1, "nav-item"],
          ["class", "nav-link text-white", "routerLink", "/login", 4, "ngIf"],
          [
            "class",
            "nav-link text-white",
            "routerLink",
            "/login",
            3,
            "click",
            4,
            "ngIf",
          ],
          [1, "btn", "btn-secondary", "position-relative"],
          ["routerLink", "/cart", 1, "nav-link", "text-white"],
          [1, "fas", "fa-shopping-cart"],
          [
            1,
            "position-absolute",
            "top-0",
            "start-100",
            "translate-middle",
            "badge",
            "rounded-pill",
            "bg-primary",
          ],
          [1, "container-fluid"],
          [1, "row"],
          [
            1,
            "sidebar",
            "border",
            "border-right",
            "col-md-3",
            "col-lg-2",
            "p-0",
            "bg-body-tertiary",
          ],
          [
            "tabindex",
            "-1",
            "id",
            "sidebarMenu",
            "aria-labelledby",
            "sidebarMenuLabel",
            1,
            "offcanvas-md",
            "offcanvas-end",
            "bg-body-tertiary",
          ],
          [
            1,
            "offcanvas-body",
            "d-md-flex",
            "flex-column",
            "p-0",
            "pt-lg-3",
            "overflow-y-auto",
          ],
          [1, "nav", "flex-column"],
          [
            "aria-current",
            "page",
            "routerLink",
            "/products",
            1,
            "nav-link",
            "d-flex",
            "align-items-center",
            "gap-2",
            "active",
          ],
          [1, "bi"],
          [0, "xlink", "href", "#house-fill"],
          [
            "class",
            "nav-link d-flex align-items-center gap-2",
            "routerLink",
            "/product-add-1",
            4,
            "ngIf",
          ],
          [
            "class",
            "nav-link d-flex align-items-center gap-2",
            "routerLink",
            "/product-add-2",
            4,
            "ngIf",
          ],
          [
            "class",
            "nav-link d-flex align-items-center gap-2",
            "routerLink",
            "/orders",
            4,
            "ngIf",
          ],
          [
            1,
            "nav-link",
            "d-flex",
            "align-items-center",
            "gap-2",
            3,
            "routerLink",
          ],
          [0, "xlink", "href", "#heart"],
          [
            "class",
            "nav-link d-flex align-items-center gap-2",
            "href",
            "#",
            4,
            "ngIf",
          ],
          ["class", "container", 4, "ngIf"],
          [1, "my-3"],
          [1, "nav", "flex-column", "mb-auto"],
          ["href", "#", 1, "nav-link", "d-flex", "align-items-center", "gap-2"],
          [0, "xlink", "href", "#gear-wide-connected"],
          ["role", "main", 1, "col-md-9", "ms-sm-auto", "col-lg-10", "px-md-4"],
          [1, "alert", "alert-secondary"],
          [1, "container", "py-5"],
          [1, "col-12", "col-md"],
          [
            "xmlns",
            "http://www.w3.org/2000/svg",
            "width",
            "24",
            "height",
            "24",
            "fill",
            "none",
            "stroke",
            "currentColor",
            "stroke-linecap",
            "round",
            "stroke-linejoin",
            "round",
            "stroke-width",
            "2",
            "role",
            "img",
            "viewBox",
            "0 0 24 24",
            1,
            "d-block",
            "mb-2",
          ],
          ["cx", "12", "cy", "12", "r", "10"],
          [
            "d",
            "M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94",
          ],
          [1, "d-block", "mb-3", "text-body-secondary"],
          [1, "col-6", "col-md"],
          [1, "list-unstyled", "text-small"],
          ["href", "#", 1, "link-secondary", "text-decoration-none"],
          ["routerLink", "/login", 1, "nav-link", "text-white"],
          [1, "fas", "fa-sign-in-alt"],
          ["routerLink", "/login", 1, "nav-link", "text-white", 3, "click"],
          [
            "routerLink",
            "/product-add-1",
            1,
            "nav-link",
            "d-flex",
            "align-items-center",
            "gap-2",
          ],
          [0, "xlink", "href", "#file-earmark"],
          [
            "routerLink",
            "/product-add-2",
            1,
            "nav-link",
            "d-flex",
            "align-items-center",
            "gap-2",
          ],
          [0, "xlink", "href", "#cart"],
          [
            "routerLink",
            "/orders",
            1,
            "nav-link",
            "d-flex",
            "align-items-center",
            "gap-2",
          ],
          [0, "xlink", "href", "#orders"],
          [0, "xlink", "href", "#puzzle"],
          [1, "container"],
          [
            1,
            "sidebar-heading",
            "d-flex",
            "justify-content-between",
            "align-items-center",
            "px-3",
            "mt-4",
            "mb-1",
            "text-body-secondary",
            "text-uppercase",
          ],
          ["href", "#", "aria-label", "Add a new report", 1, "link-secondary"],
          [0, "xlink", "href", "#plus-circle"],
          [0, "xlink", "href", "#file-earmark-text"],
        ],
        template: function (i, o) {
          i & 1 &&
            (dt(),
            f(0, "svg", 0)(1, "symbol", 1),
            E(2, "path", 2)(3, "path", 3),
            h(),
            f(4, "symbol", 4),
            E(5, "path", 5),
            h(),
            f(6, "symbol", 6),
            E(7, "path", 7)(8, "path", 8),
            h(),
            f(9, "symbol", 9),
            E(10, "path", 10),
            h(),
            f(11, "symbol", 11),
            E(12, "path", 12),
            h(),
            f(13, "symbol", 13),
            E(14, "path", 14)(15, "path", 15),
            h(),
            f(16, "symbol", 16),
            E(17, "path", 17),
            h(),
            f(18, "symbol", 18),
            E(19, "path", 19)(20, "path", 20),
            h(),
            f(21, "symbol", 21),
            E(22, "path", 22),
            h(),
            f(23, "symbol", 23),
            E(24, "path", 24),
            h(),
            f(25, "symbol", 25),
            E(26, "path", 26)(27, "path", 27),
            h(),
            f(28, "symbol", 28),
            E(29, "path", 29),
            h(),
            f(30, "symbol", 30),
            E(31, "path", 31),
            h(),
            f(32, "symbol", 32),
            E(33, "path", 33)(34, "path", 34),
            h(),
            f(35, "symbol", 35),
            E(36, "path", 36),
            h(),
            f(37, "symbol", 37),
            E(38, "path", 38),
            h()(),
            Cn(),
            f(39, "div", 39)(40, "a", 40),
            m(41, "E-Ticaret App"),
            h(),
            f(42, "ul", 41)(43, "li", 42),
            k(44, bF, 3, 0, "a", 43),
            h(),
            f(45, "li", 42),
            k(46, CF, 3, 0, "a", 44),
            h(),
            f(47, "li")(48, "button", 45)(49, "a", 46),
            E(50, "i", 47),
            m(51, " Cart"),
            f(52, "span", 48),
            m(53),
            h()()()()()(),
            f(54, "div", 49)(55, "div", 50)(56, "div", 51)(57, "div", 52)(
              58,
              "div",
              53
            )(59, "ul", 54)(60, "li", 42)(61, "a", 55),
            dt(),
            f(62, "svg", 56),
            E(63, "use", 57),
            h(),
            m(64, " Store "),
            h()(),
            Cn(),
            f(65, "li", 42),
            k(66, _F, 4, 0, "a", 58),
            h(),
            f(67, "li", 42),
            k(68, EF, 4, 0, "a", 59),
            h(),
            f(69, "li", 42),
            k(70, SF, 4, 0, "a", 60),
            h(),
            f(71, "li", 42)(72, "a", 61),
            dt(),
            f(73, "svg", 56),
            E(74, "use", 62),
            h(),
            m(75, " Favorites "),
            h()(),
            Cn(),
            f(76, "li", 42),
            k(77, IF, 4, 0, "a", 63),
            h()(),
            k(78, MF, 28, 0, "div", 64),
            E(79, "hr", 65),
            f(80, "ul", 66)(81, "li", 42)(82, "a", 67),
            dt(),
            f(83, "svg", 56),
            E(84, "use", 68),
            h(),
            m(85, " Settings "),
            h()(),
            Cn(),
            E(86, "li", 42),
            h()()()(),
            f(87, "main", 69),
            E(88, "router-outlet"),
            h()()(),
            E(89, "hr", 70),
            f(90, "footer", 71)(91, "div", 50)(92, "div", 72),
            dt(),
            f(93, "svg", 73)(94, "title"),
            m(95, "Product"),
            h(),
            E(96, "circle", 74)(97, "path", 75),
            h(),
            Cn(),
            f(98, "small", 76),
            m(99, "\xA9 2017\u20132024"),
            h()(),
            f(100, "div", 77)(101, "h5"),
            m(102, "Features"),
            h(),
            f(103, "ul", 78)(104, "li")(105, "a", 79),
            m(106, "Cool stuff"),
            h()(),
            f(107, "li")(108, "a", 79),
            m(109, "Random feature"),
            h()(),
            f(110, "li")(111, "a", 79),
            m(112, "Team feature"),
            h()(),
            f(113, "li")(114, "a", 79),
            m(115, "Stuff for developers"),
            h()(),
            f(116, "li")(117, "a", 79),
            m(118, "Another one"),
            h()(),
            f(119, "li")(120, "a", 79),
            m(121, "Last time"),
            h()()()(),
            f(122, "div", 77)(123, "h5"),
            m(124, "Resources"),
            h(),
            f(125, "ul", 78)(126, "li")(127, "a", 79),
            m(128, "Resource name"),
            h()(),
            f(129, "li")(130, "a", 79),
            m(131, "Resource"),
            h()(),
            f(132, "li")(133, "a", 79),
            m(134, "Another resource"),
            h()(),
            f(135, "li")(136, "a", 79),
            m(137, "Final resource"),
            h()()()(),
            f(138, "div", 77)(139, "h5"),
            m(140, "Resources"),
            h(),
            f(141, "ul", 78)(142, "li")(143, "a", 79),
            m(144, "Business"),
            h()(),
            f(145, "li")(146, "a", 79),
            m(147, "Education"),
            h()(),
            f(148, "li")(149, "a", 79),
            m(150, "Government"),
            h()(),
            f(151, "li")(152, "a", 79),
            m(153, "Gaming"),
            h()()()(),
            f(154, "div", 77)(155, "h5"),
            m(156, "About"),
            h(),
            f(157, "ul", 78)(158, "li")(159, "a", 79),
            m(160, "Team"),
            h()(),
            f(161, "li")(162, "a", 79),
            m(163, "Locations"),
            h()(),
            f(164, "li")(165, "a", 79),
            m(166, "Privacy"),
            h()(),
            f(167, "li")(168, "a", 79),
            m(169, "Terms"),
            h()()()()()(),
            E(170, "app-scroll-to-top")),
            i & 2 &&
              (D(44),
              M("ngIf", o.isLoggedIn() == !1),
              D(2),
              M("ngIf", o.isLoggedIn() == !0),
              D(7),
              me(" ", o.getCart(), " "),
              D(13),
              M("ngIf", o.isSuperuser == !0 || o.authStatus() == !0),
              D(2),
              M("ngIf", o.isSuperuser == !0 || o.authStatus() == !0),
              D(2),
              M("ngIf", o.isLoggedIn() == !0),
              D(2),
              M("routerLink", O0(9, TF)),
              D(5),
              M("ngIf", o.isSuperuser == !0 || o.authStatus() == !0),
              D(),
              M("ngIf", o.user == "admin"));
        },
        dependencies: [Te, Xp, et, bC],
        styles: [
          ".bi[_ngcontent-%COMP%]{display:inline-block;width:1rem;height:1rem}@media (min-width: 768px){.sidebar[_ngcontent-%COMP%]   .offcanvas-lg[_ngcontent-%COMP%]{position:-webkit-sticky;position:sticky;top:48px}.navbar-search[_ngcontent-%COMP%]{display:block}.navbar-search[_ngcontent-%COMP%]:focus-within{display:block}}.sidebar[_ngcontent-%COMP%]   .nav-link[_ngcontent-%COMP%]{font-size:.875rem;font-weight:500}.sidebar[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%]{color:#2470dc}.sidebar-heading[_ngcontent-%COMP%]{font-size:.75rem}.navbar-brand[_ngcontent-%COMP%]{padding-top:.75rem;padding-bottom:.75rem;background-color:#00000040;box-shadow:inset -1px 0 #00000040}.navbar[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{padding:.75rem 1rem}body[_ngcontent-%COMP%]{background-color:#9495978e}.navbar-nav[_ngcontent-%COMP%]{display:flex;align-items:center;list-style:none;padding:0}.nav-item[_ngcontent-%COMP%]{margin-right:10px}.navbar-nav[_ngcontent-%COMP%], .ulnav[_ngcontent-%COMP%]{display:flex;align-items:center;list-style:none;padding:0}.nav-item[_ngcontent-%COMP%], .ulnav[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-right:10px;margin-top:15px}",
        ],
      }));
    let t = e;
    return t;
  })();
var _C = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Fe({ type: e, bootstrap: [CC] })),
    (e.ɵinj = ke({
      providers: [WD(), Mt, vo, po, On, Tr],
      imports: [dc, wC, xw, LD, Aw, lb, aC],
    }));
  let t = e;
  return t;
})();
qD()
  .bootstrapModule(_C)
  .catch((t) => console.error(t));
