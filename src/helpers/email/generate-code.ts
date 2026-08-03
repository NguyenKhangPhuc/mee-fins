export function generateCode(): string {
    // đảm bảo đủ 8 chữ số, có padding số 0 phía trước nếu cần
    const code = Math.floor(Math.random() * 100_000_000); // 0 -> 99,999,999
    return code.toString().padStart(8, '0');
}