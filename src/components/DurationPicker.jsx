export default function DurationPicker({ options, currentIdx, onChange }) {
  // console.log('component: DurationPicker');
  return (
    <div data-name="duration_picker" className="flex -mx-4 -mb-4">
      {options.map(({ text }, index) => {
        const activeCSS = index === currentIdx ? 'border-white text-white' : 'border-transparent text-primary';
        return (
          <label className={'flex-1 py-2 text-center cursor-pointer border-b-3 ' + activeCSS} key={text}>
            <input
              type="radio"
              name="duration"
              id=""
              value={index}
              onChange={onChange}
              defaultChecked={index === currentIdx}
              className="!hidden"
            />
            {text}
          </label>
        );
      })}
    </div>
  );
}
