const WishlistButton = ({ active = false, onClick }) => {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}>
      {active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </button>
  );
};

export default WishlistButton;
