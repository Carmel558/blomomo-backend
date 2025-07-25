/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore: Unreachable code error                              <-- BigInt does not have `toJSON` method
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};
/* eslint-enable @typescript-eslint/ban-ts-comment */
