export const expectArray = (array: any[]) => ({
  toEqual: (expected: any[]) => {
    for (const item of expected) {
      expect(array).toContainEqual(item);
    }
  },
});
