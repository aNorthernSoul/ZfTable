<?php
namespace ZfTable\Source;

use ZfTable\Source\AbstractSource;
use Zend\Paginator\Paginator;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

class DoctrineQueryBuilder extends AbstractSource
{

    /**
     *
     * @var \Doctrine\ORM\QueryBuilder
     */
    protected $query;

    /**
     *
     * @var  \Zend\Paginator\Paginator
     */
    protected $paginator;

    /**
     *
     * @param \Doctrine\ORM\QueryBuilder $query
     */
    public function __construct($query)
    {
        $this->query = $query;
    }

    /**
     *
     * @return \Zend\Paginator\Paginator
     */
    public function getPaginator()
    {
        if (!$this->paginator) {


            $this->order();

             $ormPaginator = new ORMPaginator($this->query);
             $ormPaginator->setUseOutputWalkers(false);
             $adapter = new DoctrineAdapter($ormPaginator);
             $this->paginator = new Paginator($adapter);
             $this->initPaginator();

        }
        return $this->paginator;
    }



    protected function order()
    {
        $column = $this->getParamAdapter()->getColumn();
        $order = $this->getParamAdapter()->getOrder();

        if (!$column) {
            return;
        }

        $header = $this->getTable()->getHeader($column);
        $tableAlias = ($header) ? $header->getTableAlias() : 'q';
        $sortColumns = ($header) ? $header->getSortColumns() : null;
        $sortColumnsAsc = ($header) ? $header->getSortColumnsAsc() : null;
        $sortColumnsDesc = ($header) ? $header->getSortColumnsDesc() : null;

        if( $order == 'ASC' && is_array($sortColumnsAsc) && sizeof($sortColumnsAsc) ) {
            $first = false;
            foreach ( $sortColumnsAsc as $t ) {
                if ( !$first ) {
                    $this->query->orderBy($t, $order);
                    $first = true;
                }else {
                    $this->query->addOrderBy($t, $order);
                }
            }
        }elseif( $order == 'DESC' && is_array($sortColumnsDesc) && sizeof($sortColumnsDesc) ) {
            $first = false;
            foreach ( $sortColumnsDesc as $t ) {
                if ( !$first ) {
                    $this->query->orderBy($t, $order);
                    $first = true;
                }else {
                    $this->query->addOrderBy($t, $order);
                }
            }
        }elseif( is_array($sortColumns) && sizeof($sortColumns) ) {
            if ( $order == 'DESC' ) {
                $columns = array_reverse($sortColumns);
            }else{
                $columns = $sortColumns;
            }
            $first = false;
            foreach ( $columns as $t ) {
                if ( !$first ) {
                    $this->query->orderBy($t, $order);
                    $first = true;
                }else {
                    $this->query->addOrderBy($t, $order);
                }
            }
        }else{
            if (false === strpos($tableAlias, '.')) {
                $tableAlias = $tableAlias . '.' . $column;
            }

            $this->query->orderBy($tableAlias, $order);
        }
    }


    public function getQuery()
    {
        return $this->query;
    }

    public function getSource()
    {
        return $this->query;
    }
}
