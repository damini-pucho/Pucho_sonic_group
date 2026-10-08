// Form — a single-screen form bound to a flow action. Used on public pages (no login) and anywhere a stepper is too much.
import { useState } from 'react';
import { Button } from 'antd';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import Fields, { missingFields } from '../Fields';
import { runAction } from '../../utils/api';
import { CARD, SECTION_TITLE } from '../Charts';

export default function Form({ block, data, entity }) {
  const init = () => Object.fromEntries((block.fields ?? []).map((f) => [f.key, f.default ?? '']));
  const [values, setValues] = useState(init); const [busy, setBusy] = useState(false); const [done, setDone] = useState(null);
  const submit = async () => {
    const miss = missingFields(block.fields, values); if (miss.length) return toast.error(`Please fill: ${miss.map((f) => f.label).join(', ')}`);
    setBusy(true);
    try { const res = await runAction(block, { ...(block.context ?? {}), ...values }); setDone(res ?? {}); toast.success(block.success ?? 'Submitted'); }
    catch (e) { toast.error(e.message || 'Something went wrong'); } finally { setBusy(false); }
  };
  const ref = done && Object.entries(done).find(([k]) => /_ID$|_No$/.test(k));
  return (
    <div className={`${CARD} p-6 sm:p-8`} data-os-form-block>
      {done ? (
        <div className="text-center py-6 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="font-display text-lg font-semibold text-gray-900">{block.done ?? 'Thank you — we have received it.'}</p>
          {ref && <p className="font-mono text-primary-600">{ref[1]}</p>}
          <Button className="mt-2" onClick={() => { setDone(null); setValues(init()); }}>{block.again ?? 'Submit another'}</Button>
        </div>
      ) : (
        <div className="os-form" data-os-form>
          {block.title && <h3 className={`${SECTION_TITLE} mb-1`}>{block.title}</h3>}
          {block.intro && <p className="text-sm text-gray-600 mb-5">{block.intro}</p>}
          <Fields fields={block.fields} values={values} setValues={setValues} data={data} entity={entity} columns={block.columns ?? 1} />
          <div className="flex justify-end mt-6"><Button type="primary" size="large" loading={busy} onClick={submit} data-os-action={block.id}>{block.submit ?? 'Submit'}</Button></div>
        </div>
      )}
    </div>
  );
}
