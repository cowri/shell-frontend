/* global BigInt */

export const NUMERATOR = BigInt(1e18)

export default class TimeWeightedBalance {
    lastSeen;
    current;
    acc;

    constructor(startingBalance, startBlockNumber) {
        this.acc = BigInt(0)
        this.current = startingBalance
        this.lastSeen = startBlockNumber
    }

    add(amount, now, supply) {
        this._update(supply, now);
        this.current += amount
    }

    _add(amount, now) {
        this.lastSeen = now
        this.current += amount
    }

    _sub(amount, now) {
        this.lastSeen = now
        this.current -= amount
    }

    sub(amount, now, supply) {
        this._update(supply, now);
        this.current -= amount
    }

    _update(supply, now) {
        if (now < this.lastSeen) {
            throw new Error("downTime")
        }
        const timePast = now - this.lastSeen;
        this.acc += (this.current * NUMERATOR / supply) * BigInt(timePast)
        this.lastSeen = now
    }

    finalize(now, supply) {
        const timePast = now - this.lastSeen;
        return this.acc + (this.current * NUMERATOR / supply) * BigInt(timePast)
    }
}