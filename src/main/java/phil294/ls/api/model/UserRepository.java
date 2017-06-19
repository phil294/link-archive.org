package phil294.ls.api.model;

import org.springframework.data.repository.CrudRepository;

/**
 * User: phi
 * Date: 18.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public interface UserRepository extends CrudRepository<User, Integer>
{
	User findByNameAndPassword(String name, String password); // todo dont return (hashed)pass
	
}
