# Workflow complexity

Budget per action path: ≤ 12 steps · ≤ 1 AI call (2 with a code check between) · no nested router · no CODE node > 40 lines · no two CODE nodes in a row. Per flow: ≤ 12 actions.

## BILL_READ — 2 action(s), longest path 7 steps, within budget

| action path | steps | AI calls | router depth | longest CODE |
|---|---:|---:|---:|---:|
| extract | 7 | 1 | 1 | — |
| unknown action | 4 | 0 | 1 | — |

## SALES_INVOICE — 2 action(s), longest path 8 steps, within budget

| action path | steps | AI calls | router depth | longest CODE |
|---|---:|---:|---:|---:|
| raise | 8 | 0 | 1 | — |
| unknown action | 4 | 0 | 1 | — |

