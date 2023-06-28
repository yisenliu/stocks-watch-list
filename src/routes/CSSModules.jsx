import styles from './cssmodules.module.sass';

export default function cssmodules() {
  return (
    <div>
      <h2 className={styles.title}>Title</h2>
      <div className={styles.content}>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora dolor nesciunt pariatur enim placeat neque
          repellendus tenetur eaque. Totam laudantium voluptate quo fuga adipisci tempora explicabo iste distinctio
          ipsam! Cum.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus unde architecto odio sequi, in dignissimos
          illo rerum? Harum, id vero.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam, sunt culpa laboriosam vel ipsa sit earum
          autem itaque aut eveniet unde. Veritatis dolore quas blanditiis consequatur nihil similique, molestiae natus
          velit neque totam hic reiciendis! Odit in esse beatae commodi.
        </p>
      </div>
    </div>
  );
}
