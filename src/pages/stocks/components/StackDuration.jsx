export default function StackDuration({ options, currentIdx, onChange }) {
  return (
    <div className="w-96 sm:w-full flex mx-auto border border-gray-400 rounded">
      {options.map(({ text }, index) => {
        const activeCSS = index === currentIdx ? 'bg-info text-white' : '';
        return (
          <label className={'flex-1 p-2 text-center cursor-pointer ' + activeCSS} key={text}>
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
