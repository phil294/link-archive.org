package phil294.ls.api.model;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Set;

/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public interface AttributeRepository extends CrudRepository<Attribute, Integer>
{
	List<Attribute> findByIdNotInOrderByInterestDesc(Set<Integer> attributeIds, Pageable pageable);
	
	List<Attribute> findAllByOrderByInterestDesc();
	
	//List<Attribute> findAllOrderByInterest
}
