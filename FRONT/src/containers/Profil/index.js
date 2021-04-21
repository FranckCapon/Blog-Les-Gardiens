import { connect } from 'react-redux';
import Profil from 'src/components/Profil';

const mapStateToProps = (state) => ({
  // loading: state.user.loading,
  firstName: state.user.firstName,
  lastName: state.user.lastName,
  pseudo: state.user.pseudo,
  emailAddress: state.user.emailAddress,
  role: state.user.role,
});

// const mapDispatchToProps = {};
export default connect(mapStateToProps, null)(Profil);
