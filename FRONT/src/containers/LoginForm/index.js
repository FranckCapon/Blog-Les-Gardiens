import { connect } from 'react-redux';
import LoginForm from 'src/components/LoginForm';
import {
  setFieldValue,
  sendLogin,
  logout,
  emailSubmit,
} from 'src/actions/user';

const mapStateToProps = (state) => ({
  loading: state.user.loading,
  pseudo: state.user.pseudo,
  password: state.user.password,
  isLogged: state.user.logged,
  newEmail: state.user.newEmail,
  error: state.user.error,
});
const mapDispatchToProps = (dispatch) => ({
  changeField: (value, name) => dispatch(setFieldValue(value, name)),
  handleLogin: () => dispatch(sendLogin()),
  handleLogout: () => dispatch(logout()),
  emailSubmit: () => dispatch(emailSubmit()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
