export default function DurationPicker({ options, currentIdx, onChange }) {
  // console.log('component: DurationPicker');
  return (
    <div className="w-96 sm:w-full flex mx-auto -mb-4">
      {options.map(({ text }, index) => {
        const activeCSS = index === currentIdx ? 'border-white text-white' : 'border-transparent text-primary';
        return (
          <label className={'flex-1 p-2 text-center cursor-pointer border-b-3 ' + activeCSS} key={text}>
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
