# Bug Analysis & Fix Workflow

## 1. Reproduction
- Locate the faulty behavior.
- Create a minimal reproduction case.
- Write a failing test (Vitest/Playwright).

## 2. Analysis
- Trace the code execution path.
- Identify the root cause (Race condition? Logical error? Edge case?).

## 3. Implementation
- Apply fix in a isolated PR/branch.
- Ensure the fix doesn't introduce regressions.

## 4. Closure
- Verify the test now passes.
- Document the fix in the commit message.
